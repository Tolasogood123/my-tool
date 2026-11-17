"use client";

import { useMemo, useState } from "react";
import { AlignLeft, Clock, RotateCcw, Type } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { formatNumber } from "@/lib/utils/format";

interface Stats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingMinutes: number;
  usedIntlSegmenter: boolean;
}

function analyze(text: string): Stats {
  const trimmed = text.trim();
  let words = 0;
  let usedIntlSegmenter = false;

  if (trimmed) {
    const Segmenter = (Intl as typeof Intl & {
      Segmenter?: new (
        locale?: string,
        options?: { granularity: "word" },
      ) => { segment(input: string): Iterable<{ isWordLike?: boolean }> };
    }).Segmenter;

    if (Segmenter) {
      const segmenter = new Segmenter(undefined, { granularity: "word" });
      for (const part of segmenter.segment(text)) {
        if (part.isWordLike) words += 1;
      }
      usedIntlSegmenter = true;
    } else {
      words = trimmed.split(/\s+/).filter(Boolean).length;
    }
  }

  const sentences = trimmed
    ? trimmed.split(/[.!?。！？]+(?=\s|$)/).filter((part) => part.trim()).length
    : 0;
  const paragraphs = trimmed
    ? trimmed.split(/\n\s*\n/).filter((part) => part.trim()).length
    : 0;

  return {
    words,
    characters: [...text].length,
    charactersNoSpaces: [...text.replace(/\s/g, "")].length,
    sentences,
    paragraphs,
    readingMinutes: words === 0 ? 0 : Math.ceil(words / 200),
    usedIntlSegmenter,
  };
}

export function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyze(text), [text]);

  const cards = [
    { label: "Words", value: stats.words, icon: Type },
    { label: "Characters", value: stats.characters, icon: AlignLeft },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces, icon: AlignLeft },
    { label: "Sentences", value: stats.sentences, icon: AlignLeft },
    { label: "Paragraphs", value: stats.paragraphs, icon: AlignLeft },
    { label: "Reading time (min)", value: stats.readingMinutes, icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <Field
        label="Your text"
        htmlFor="word-counter-input"
        hint="Statistics update as you type. Khmer and other non-spaced scripts use the browser's international segmentation when available."
      >
        <Textarea
          id="word-counter-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste or write your text here…"
          className="min-h-72 text-sm leading-7"
        />
      </Field>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-subtle-foreground">
          {stats.usedIntlSegmenter
            ? "Language-aware word counting is active."
            : "Basic whitespace counting (this browser lacks Intl.Segmenter)."}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setText("")}
          disabled={!text}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-card border border-border bg-surface p-5"
          >
            <card.icon className="size-4 text-subtle-foreground" aria-hidden="true" />
            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {formatNumber(card.value)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
