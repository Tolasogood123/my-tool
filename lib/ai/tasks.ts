/**
 * Server-side AI task definitions. Shared by the API route and the
 * client UI so limits and labels never drift apart.
 */
export interface AiTask {
  label: string;
  system: string;
  maxInputChars: number;
  maxOutputTokens: number;
  options?: { id: string; label: string; values: { value: string; label: string }[] };
}

export const AI_TASKS = {
  "improve-writing": {
    label: "Improve this writing",
    system:
      "You are a careful writing editor. Rewrite the user's text to be clearer and more concise while preserving its meaning, voice, and language. Reply with only the rewritten text, without commentary or headings.",
    maxInputChars: 4000,
    maxOutputTokens: 800,
    options: {
      id: "tone",
      label: "Tone",
      values: [
        { value: "clear", label: "Clear and direct" },
        { value: "professional", label: "Professional" },
        { value: "friendly", label: "Friendly" },
      ],
    },
  },
  summarize: {
    label: "Summarize this text",
    system:
      "You are a summarization assistant. Summarize the user's text faithfully without inventing facts. Keep the original language. Reply with only the summary.",
    maxInputChars: 8000,
    maxOutputTokens: 500,
    options: {
      id: "length",
      label: "Summary length",
      values: [
        { value: "short", label: "A few sentences" },
        { value: "medium", label: "One paragraph" },
        { value: "detailed", label: "Detailed bullets" },
      ],
    },
  },
  "generate-titles": {
    label: "Generate titles",
    system:
      "You are a headline writer. Based on the user's text, suggest concise, specific titles that accurately describe the content. Do not use clickbait. Reply with one title per line and no numbering.",
    maxInputChars: 3000,
    maxOutputTokens: 400,
    options: {
      id: "count",
      label: "How many",
      values: [
        { value: "3", label: "3 titles" },
        { value: "5", label: "5 titles" },
        { value: "10", label: "10 titles" },
      ],
    },
  },
} satisfies Record<string, AiTask>;

export type AiTaskId = keyof typeof AI_TASKS;

export function isAiTaskId(value: unknown): value is AiTaskId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(AI_TASKS, value);
}

export function isTaskOptionValid(task: AiTaskId, option: unknown): boolean {
  const config = AI_TASKS[task];
  if (!config.options) return option === undefined || option === "";
  return typeof option === "string" && config.options.values.some((value) => value.value === option);
}
