"use client";

import { useMemo, useState } from "react";
import {
  Bold,
  Code2,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  PenLine,
  Quote,
  RotateCcw,
  Table2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { ToolOutput } from "@/components/tools/ToolOutput";

interface ToolbarAction {
  label: string;
  icon: typeof Bold;
  insert: string;
  wrap: boolean;
}

const actions: ToolbarAction[] = [
  { label: "Heading", icon: Heading2, insert: "## Heading", wrap: false },
  { label: "Bold", icon: Bold, insert: "**", wrap: true },
  { label: "Italic", icon: Italic, insert: "_", wrap: true },
  { label: "Link", icon: Link2, insert: "[label](https://example.com)", wrap: false },
  { label: "Bullet list", icon: List, insert: "- List item", wrap: false },
  { label: "Numbered list", icon: ListOrdered, insert: "1. List item", wrap: false },
  { label: "Quote", icon: Quote, insert: "> Quote", wrap: false },
  { label: "Code", icon: Code2, insert: "`code`", wrap: false },
  { label: "Table", icon: Table2, insert: "| Column | Column |\n| --- | --- |\n| Value | Value |", wrap: false },
];

export function MarkdownEditor() {
  const [markdown, setMarkdown] = useState("");
  const textareaId = "markdown-source";

  const words = useMemo(() => markdown.trim().split(/\s+/).filter(Boolean).length, [markdown]);

  const insert = (action: ToolbarAction) => {
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.slice(start, end);
    const insertion = action.wrap
      ? `${action.insert}${selected || "text"}${action.insert}`
      : action.insert;
    const next = `${markdown.slice(0, start)}${insertion}${markdown.slice(end)}`;
    setMarkdown(next);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + insertion.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const reset = () => setMarkdown("");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            type="button"
            size="sm"
            variant="outline"
            onClick={() => insert(action)}
            title={action.label}
          >
            <action.icon className="size-4" aria-hidden="true" />
            <span className="sr-only">{action.label}</span>
          </Button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Markdown" htmlFor={textareaId} hint="Nothing leaves your device.">
          <Textarea
            id={textareaId}
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            placeholder={"# Title\n\nStart writing…"}
            className="min-h-80 font-mono text-xs leading-6"
          />
        </Field>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sanitized preview</span>
            <span className="text-xs text-subtle-foreground">{words} words</span>
          </div>
          <div
            aria-label="Markdown preview"
            className="prose prose-neutral min-h-80 max-w-none overflow-auto rounded-control border border-border bg-surface p-5 dark:prose-invert prose-headings:font-semibold prose-a:text-accent prose-pre:bg-surface-muted prose-pre:text-foreground prose-code:text-foreground"
          >
            {markdown.trim() ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
              >
                {markdown}
              </ReactMarkdown>
            ) : (
              <p className="text-sm text-muted-foreground">The preview appears as you type.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="ghost" onClick={reset} disabled={!markdown}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Clear
        </Button>
        <span className="inline-flex items-center gap-1.5 self-center text-xs text-subtle-foreground">
          <PenLine className="size-3.5" aria-hidden="true" />
          Paste safely — scripts and event handlers are stripped from the preview.
        </span>
      </div>

      <ToolOutput
        label="Markdown source"
        value={markdown}
        filename="draft.md"
        mimeType="text/markdown;charset=utf-8"
        rows={4}
      />
    </div>
  );
}
