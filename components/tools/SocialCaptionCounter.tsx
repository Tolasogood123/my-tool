"use client";

import { useMemo, useState } from "react";
import { MessageSquare, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { formatNumber } from "@/lib/utils/format";

const PLATFORMS = [
  { name: "X / Twitter", limit: 280 },
  { name: "Threads", limit: 500 },
  { name: "Instagram", limit: 2200 },
  { name: "TikTok", limit: 2200 },
  { name: "LinkedIn", limit: 3000 },
  { name: "Facebook", limit: 63206 },
];

export function SocialCaptionCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const characters = [...text].length;
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    return { characters, words, lines };
  }, [text]);

  const reset = () => setText("");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Your caption" htmlFor="sc-caption" hint="Characters are counted as Unicode code points, so most emoji count as one.">
          <Textarea
            id="sc-caption"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Write a caption and check it against each platform…"
            className="min-h-64 text-sm leading-7"
          />
        </Field>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {formatNumber(stats.characters)} characters · {formatNumber(stats.words)} words · {formatNumber(stats.lines)} lines
          </p>
          <Button variant="ghost" size="sm" onClick={reset} disabled={!text}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Clear
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <MessageSquare className="size-4 text-accent" aria-hidden="true" />
          Platform limits
        </h2>
        {PLATFORMS.map((platform) => {
          const remaining = platform.limit - stats.characters;
          const over = remaining < 0;
          const percent = Math.min(100, (stats.characters / platform.limit) * 100);

          return (
            <div key={platform.name} className="rounded-card border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{platform.name}</span>
                <span className={over ? "font-semibold text-danger" : "text-muted-foreground"}>
                  {over
                    ? `${formatNumber(Math.abs(remaining))} over`
                    : `${formatNumber(remaining)} left`}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className={`h-full rounded-full ${over ? "bg-danger" : "bg-accent"}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-subtle-foreground">
                Limit {formatNumber(platform.limit)} characters
              </p>
            </div>
          );
        })}
        <ToolOutput label="Caption text" value={text} rows={4} />
      </div>
    </div>
  );
}
