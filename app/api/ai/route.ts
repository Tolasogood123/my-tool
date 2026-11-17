import { connection } from "next/server";
import {
  AI_TASKS,
  isAiTaskId,
  isTaskOptionValid,
} from "@/lib/ai/tasks";

const RATE_WINDOW_MS = 60 * 60 * 1000;
const DEFAULT_RATE_LIMIT = 10;
const MAX_BODY_CHARS = 20_000;
const MAX_OUTPUT_CHARS = 8_000;

/**
 * In-memory, per-process rate limiter. This protects a single instance;
 * a multi-instance deployment should replace it with a shared store
 * (for example Upstash Redis) before enabling AI tools publicly.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): { allowed: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const configured = Number(process.env.AI_RATE_LIMIT_PER_HOUR);
  const limit =
    Number.isInteger(configured) && configured > 0 ? configured : DEFAULT_RATE_LIMIT;

  const entry = attempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, retryAfter: 0 };
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim().slice(0, 64);
  return request.headers.get("x-real-ip")?.slice(0, 64) ?? "local";
}

function noStore(json: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(json, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

/** Reports whether the server has a key configured. No secret is exposed. */
export async function GET() {
  await connection();
  return noStore({
    configured: Boolean(process.env.OPENAI_API_KEY),
    provider: "OpenAI-compatible chat completions API",
    tasks: Object.keys(AI_TASKS),
  });
}

export async function POST(request: Request) {
  const limit = rateLimit(clientIp(request));
  if (!limit.allowed) {
    return noStore(
      { error: "Too many requests. Please wait before trying again." },
      429,
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return noStore(
      {
        error:
          "AI service is not configured. The site owner must set OPENAI_API_KEY in the server environment.",
        code: "NOT_CONFIGURED",
      },
      503,
    );
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_CHARS) {
      return noStore({ error: "Request is too large." }, 413);
    }
    body = JSON.parse(raw);
  } catch {
    return noStore({ error: "Invalid request body." }, 400);
  }

  if (!body || typeof body !== "object") {
    return noStore({ error: "Invalid request body." }, 400);
  }

  const { task, text, option } = body as Record<string, unknown>;

  if (!isAiTaskId(task)) {
    return noStore({ error: "Unknown AI task." }, 400);
  }
  if (typeof text !== "string" || text.trim().length === 0) {
    return noStore({ error: "Enter some text first." }, 400);
  }
  if (text.length > AI_TASKS[task].maxInputChars) {
    return noStore(
      { error: `Text must be ${AI_TASKS[task].maxInputChars} characters or fewer.` },
      400,
    );
  }
  if (!isTaskOptionValid(task, option)) {
    return noStore({ error: "Invalid option for this task." }, 400);
  }

  const config = AI_TASKS[task];
  const instructions = [
    config.system,
    option ? `Requested style or detail: ${option}.` : "",
    `User text:\n${text.trim()}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const endpoint = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  try {
    const upstream = await fetch(`${endpoint.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: config.system },
          { role: "user", content: instructions },
        ],
        max_tokens: config.maxOutputTokens,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(30_000),
      cache: "no-store",
    });

    if (!upstream.ok) {
      // Never forward the upstream body: it can contain account details.
      const message =
        upstream.status === 401 || upstream.status === 403
          ? "The AI provider rejected the configured key. Contact the site owner."
          : upstream.status === 429
            ? "The AI provider is busy. Please try again later."
            : "The AI provider is unavailable. Please try again later.";
      return noStore({ error: message }, 502);
    }

    const data = (await upstream.json()) as {
      choices?: { message?: { content?: unknown } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      return noStore({ error: "The AI provider returned an empty result." }, 502);
    }

    return noStore(
      { result: content.trim().slice(0, MAX_OUTPUT_CHARS) },
      200,
      { "X-RateLimit-Remaining": String(limit.remaining) },
    );
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return noStore(
      {
        error: timedOut
          ? "The AI provider took too long to respond. Please try again."
          : "Could not reach the AI provider. Please try again later.",
      },
      502,
    );
  }
}
