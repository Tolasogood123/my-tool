"use client";

import { AiToolPanel } from "@/components/tools/AiToolPanel";

export function AiSummarizer() {
  return (
    <AiToolPanel
      task="summarize"
      inputLabel="Text to summarize"
      placeholder="Paste an article, report, or long message…"
      outputLabel="Summary"
      hint="The summary keeps your language and does not invent facts. Uploaded text is sent to the configured AI provider."
      rows={14}
    />
  );
}
