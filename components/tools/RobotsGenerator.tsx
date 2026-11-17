"use client";

import { useState } from "react";
import { RotateCcw, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { generateRobots } from "@/lib/utils/robots";
import type { RobotsInput } from "@/lib/utils/robots";

const empty: RobotsInput = { allow: "/", disallow: "/design\n/private", sitemap: "https://example.com/sitemap.xml", crawlDelay: "" };

export function RobotsGenerator() {
  const [input, setInput] = useState<RobotsInput>(empty);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<RobotsInput>) => setInput((current) => ({ ...current, ...patch }));

  const generate = () => {
    const output = generateRobots(input);
    setText(output.text);
    setError(output.error);
  };

  const reset = () => {
    setInput(empty);
    setText("");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Disallowed paths" htmlFor="robots-disallow" hint="One path per line or separated by commas.">
          <Textarea id="robots-disallow" value={input.disallow} onChange={(event) => update({ disallow: event.target.value })} rows={4} className="font-mono text-xs" />
        </Field>
        <Field label="Explicitly allowed paths" htmlFor="robots-allow" hint="Optional; useful after a broad disallow rule.">
          <Textarea id="robots-allow" value={input.allow} onChange={(event) => update({ allow: event.target.value })} rows={3} className="font-mono text-xs" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Sitemap URL" htmlFor="robots-sitemap">
            <Input id="robots-sitemap" type="url" value={input.sitemap} onChange={(event) => update({ sitemap: event.target.value })} />
          </Field>
          <Field label="Crawl delay (seconds)" htmlFor="robots-delay" hint="Optional and unsupported by some crawlers.">
            <Input id="robots-delay" type="number" min={0} value={input.crawlDelay} onChange={(event) => update({ crawlDelay: event.target.value })} placeholder="Leave empty" />
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={generate}>
            <WandSparkles className="size-4" aria-hidden="true" />
            Generate robots.txt
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? <ErrorState title="Check your rules" description={error} /> : null}
      </div>

      <div className="space-y-4">
        <ToolOutput label="robots.txt" value={text} filename="robots.txt" mimeType="text/plain;charset=utf-8" rows={12} />
        <p className="text-xs text-subtle-foreground">
          Save the generated text as <code className="font-mono">robots.txt</code> in your site root. Robots rules are guidance for well-behaved crawlers, not access control.
        </p>
      </div>
    </div>
  );
}
