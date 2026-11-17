"use client";

import { useState } from "react";
import { Eye, RotateCcw, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { generateOgTags } from "@/lib/utils/og";
import type { OgInput } from "@/lib/utils/og";

const empty: OgInput = {
  title: "",
  description: "",
  url: "",
  imageUrl: "",
  siteName: "",
  type: "website",
};

export function OgGenerator() {
  const [input, setInput] = useState<OgInput>(empty);
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<OgInput>) => setInput((current) => ({ ...current, ...patch }));

  const generate = () => {
    const output = generateOgTags(input);
    setTags(output.tags);
    setError(output.error);
  };

  const reset = () => {
    setInput(empty);
    setTags("");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Field label="Title" htmlFor="og-title" hint="Shown as the headline in link previews.">
          <Input id="og-title" value={input.title} onChange={(event) => update({ title: event.target.value })} placeholder="How to Compress Images" />
        </Field>
        <Field label="Description" htmlFor="og-description">
          <Textarea id="og-description" value={input.description} onChange={(event) => update({ description: event.target.value })} rows={3} placeholder="A short, useful summary of the page." />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Page URL" htmlFor="og-url">
            <Input id="og-url" type="url" value={input.url} onChange={(event) => update({ url: event.target.value })} placeholder="https://example.com/page" />
          </Field>
          <Field label="Image URL" htmlFor="og-image">
            <Input id="og-image" type="url" value={input.imageUrl} onChange={(event) => update({ imageUrl: event.target.value })} placeholder="https://example.com/image.png" />
          </Field>
          <Field label="Site name" htmlFor="og-site">
            <Input id="og-site" value={input.siteName} onChange={(event) => update({ siteName: event.target.value })} placeholder="TolaDev" />
          </Field>
          <Field label="Content type" htmlFor="og-type">
            <Select id="og-type" value={input.type} onChange={(event) => update({ type: event.target.value })}>
              <option value="website">website</option>
              <option value="article">article</option>
              <option value="product">product</option>
            </Select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={generate}>
            <WandSparkles className="size-4" aria-hidden="true" />
            Generate tags
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? <ErrorState title="Check your inputs" description={error} /> : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-card border border-border bg-surface p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Eye className="size-4 text-accent" aria-hidden="true" />
            Preview (approximate)
          </p>
          {input.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- user-supplied preview URL
            <img src={input.imageUrl} alt="Open Graph preview" className="mt-3 aspect-2/1 w-full rounded-control border border-border object-cover" />
          ) : null}
          <p className="mt-3 text-xs text-subtle-foreground">{input.siteName || "example.com"}</p>
          <p className="mt-1 text-base font-semibold">{input.title || "Your page title"}</p>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {input.description || "Your description will appear here in link previews."}
          </p>
        </div>
        <ToolOutput label="Meta tags" value={tags} filename="open-graph-tags.html" mimeType="text/html;charset=utf-8" rows={10} />
      </div>
    </div>
  );
}
