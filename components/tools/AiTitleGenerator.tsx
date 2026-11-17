"use client";

import { AiToolPanel } from "@/components/tools/AiToolPanel";

export function AiTitleGenerator() {
  return (
    <AiToolPanel
      task="generate-titles"
      inputLabel="Describe your content"
      placeholder="What is your article, video, or product page about?"
      outputLabel="Suggested titles"
      hint="Titles are specific and non-clickbait. Review them before using them publicly."
      rows={8}
    />
  );
}
