"use client";

import { useState } from "react";
import { Braces, RotateCcw, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { buildSchema } from "@/lib/utils/schema";
import type { SchemaInput, SchemaType } from "@/lib/utils/schema";

const empty: SchemaInput = {
  type: "website",
  name: "",
  url: "",
  description: "",
  author: "",
  questions: "",
};

export function SchemaMarkupGenerator() {
  const [input, setInput] = useState<SchemaInput>(empty);
  const [json, setJson] = useState("");
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<SchemaInput>) => setInput((current) => ({ ...current, ...patch }));

  const generate = () => {
    const output = buildSchema(input);
    setJson(output.json);
    setError(output.error);
  };

  const reset = () => {
    setInput(empty);
    setJson("");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Schema type" htmlFor="schema-type">
          <Select id="schema-type" value={input.type} onChange={(event) => update({ type: event.target.value as SchemaType })}>
            <option value="website">WebSite</option>
            <option value="organization">Organization</option>
            <option value="article">BlogPosting</option>
            <option value="faq">FAQPage</option>
          </Select>
        </Field>
        <Field label={input.type === "article" ? "Headline" : "Name"} htmlFor="schema-name">
          <Input id="schema-name" value={input.name} onChange={(event) => update({ name: event.target.value })} placeholder={input.type === "article" ? "My first guide" : "TolaDev"} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="URL" htmlFor="schema-url">
            <Input id="schema-url" type="url" value={input.url} onChange={(event) => update({ url: event.target.value })} placeholder="https://example.com" />
          </Field>
          {input.type === "article" ? (
            <Field label="Author" htmlFor="schema-author">
              <Input id="schema-author" value={input.author} onChange={(event) => update({ author: event.target.value })} placeholder="Author name" />
            </Field>
          ) : null}
        </div>
        {input.type !== "faq" ? (
          <Field label="Description" htmlFor="schema-description">
            <Textarea id="schema-description" value={input.description} onChange={(event) => update({ description: event.target.value })} rows={3} />
          </Field>
        ) : (
          <Field label="Questions and answers" htmlFor="schema-questions" hint="Put Q: and A: on separate lines for each pair.">
            <Textarea id="schema-questions" value={input.questions} onChange={(event) => update({ questions: event.target.value })} rows={7} className="font-mono text-xs" placeholder={"Q: Is it free?\nA: Yes, the core tools are free."} />
          </Field>
        )}
        <div className="flex flex-wrap gap-3">
          <Button onClick={generate}>
            <WandSparkles className="size-4" aria-hidden="true" />
            Generate JSON-LD
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? <ErrorState title="Check your inputs" description={error} icon={Braces} /> : null}
      </div>

      <div className="space-y-4">
        <ToolOutput label="JSON-LD" value={json} filename="schema.jsonld" mimeType="application/ld+json;charset=utf-8" rows={14} />
        <p className="text-xs text-subtle-foreground">
          Paste the output into a <code className="font-mono">&lt;script type=&quot;application/ld+json&quot;&gt;</code> tag. Only the fields you provide are included.
        </p>
      </div>
    </div>
  );
}
