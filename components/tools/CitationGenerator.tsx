"use client";

import { useState } from "react";
import { FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  buildCitation,
  buildInTextCitation,
  emptyCitation,
  validateCitationInput,
  type CitationInput,
  type CitationStyle,
  type SourceType,
} from "@/lib/utils/citation";

type FieldKey = keyof CitationInput;

export function CitationGenerator() {
  const [style, setStyle] = useState<CitationStyle>("apa");
  const [sourceType, setSourceType] = useState<SourceType>("website");
  const [input, setInput] = useState<CitationInput>(emptyCitation);
  const [citation, setCitation] = useState("");
  const [inText, setInText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const setField = (key: FieldKey, value: string) => {
    setInput((current) => ({ ...current, [key]: value }));
    setError(null);
  };

  const generate = () => {
    setError(null);
    setCitation("");
    setInText("");
    const validation = validateCitationInput(input, sourceType);
    if (validation) {
      setError(validation);
      return;
    }
    setCitation(buildCitation(input, style, sourceType));
    setInText(buildInTextCitation(input, style));
  };

  const reset = () => {
    setStyle("apa");
    setSourceType("website");
    setInput(emptyCitation);
    setCitation("");
    setInText("");
    setError(null);
  };

  const isWebsite = sourceType === "website";
  const isBook = sourceType === "book";
  const isJournal = sourceType === "journal";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Citation style" htmlFor="citation-style">
            <Select
              id="citation-style"
              value={style}
              onChange={(event) => {
                setStyle(event.target.value as CitationStyle);
                setCitation("");
                setInText("");
              }}
            >
              <option value="apa">APA 7th edition</option>
              <option value="mla">MLA 9th edition</option>
            </Select>
          </Field>
          <Field label="Source type" htmlFor="citation-source">
            <Select
              id="citation-source"
              value={sourceType}
              onChange={(event) => {
                setSourceType(event.target.value as SourceType);
                setCitation("");
                setInText("");
                setError(null);
              }}
            >
              <option value="website">Website</option>
              <option value="book">Book</option>
              <option value="journal">Journal article</option>
            </Select>
          </Field>
        </div>

        <Field
          label="Author(s)"
          htmlFor="citation-authors"
          hint="Use “Last, First”. Separate multiple authors with & or “and”."
        >
          <Input
            id="citation-authors"
            value={input.authors}
            onChange={(event) => setField("authors", event.target.value)}
            placeholder="Smith, John"
          />
        </Field>

        <Field label={isBook ? "Book title" : isJournal ? "Article title" : "Page title"} htmlFor="citation-title">
          <Input
            id="citation-title"
            value={input.title}
            onChange={(event) => setField("title", event.target.value)}
            placeholder={isBook ? "Learning in Public" : "How to take better notes"}
          />
        </Field>

        {!isBook ? (
          <Field label={isJournal ? "Journal name" : "Website name"} htmlFor="citation-container">
            <Input
              id="citation-container"
              value={input.container}
              onChange={(event) => setField("container", event.target.value)}
              placeholder={isJournal ? "Journal of Education" : "TolaDev Blog"}
            />
          </Field>
        ) : (
          <Field label="Publisher" htmlFor="citation-publisher">
            <Input
              id="citation-publisher"
              value={input.publisher}
              onChange={(event) => setField("publisher", event.target.value)}
              placeholder="Example Press"
            />
          </Field>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Year" htmlFor="citation-year">
            <Input
              id="citation-year"
              value={input.year}
              onChange={(event) => setField("year", event.target.value)}
              placeholder="2026"
            />
          </Field>
          {!isBook ? (
            <>
              <Field label="Month" htmlFor="citation-month">
                <Input
                  id="citation-month"
                  value={input.month}
                  onChange={(event) => setField("month", event.target.value)}
                  placeholder="March or 3"
                />
              </Field>
              <Field label="Day" htmlFor="citation-day">
                <Input
                  id="citation-day"
                  value={input.day}
                  onChange={(event) => setField("day", event.target.value)}
                  placeholder="14"
                />
              </Field>
            </>
          ) : (
            <Field label="Edition" htmlFor="citation-edition">
              <Input
                id="citation-edition"
                value={input.edition}
                onChange={(event) => setField("edition", event.target.value)}
                placeholder="2nd"
              />
            </Field>
          )}
        </div>

        {isJournal ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Volume" htmlFor="citation-volume">
              <Input id="citation-volume" value={input.volume} onChange={(event) => setField("volume", event.target.value)} placeholder="12" />
            </Field>
            <Field label="Issue" htmlFor="citation-issue">
              <Input id="citation-issue" value={input.issue} onChange={(event) => setField("issue", event.target.value)} placeholder="3" />
            </Field>
            <Field label="Pages" htmlFor="citation-pages">
              <Input id="citation-pages" value={input.pages} onChange={(event) => setField("pages", event.target.value)} placeholder="45-58" />
            </Field>
          </div>
        ) : null}

        {isWebsite ? (
          <Field label="Accessed date" htmlFor="citation-accessed" hint="YYYY-MM-DD works, or any plain date.">
            <Input
              id="citation-accessed"
              value={input.accessed}
              onChange={(event) => setField("accessed", event.target.value)}
              placeholder="2026-11-22"
            />
          </Field>
        ) : null}

        <Field label={isBook ? "DOI (optional)" : "URL"} htmlFor="citation-url">
          <Input
            id="citation-url"
            value={input.url}
            onChange={(event) => setField("url", event.target.value)}
            placeholder={isBook ? "https://doi.org/..." : "https://example.com/article"}
          />
        </Field>

        {!isBook ? (
          <Field label="DOI (optional)" htmlFor="citation-doi">
            <Input
              id="citation-doi"
              value={input.doi}
              onChange={(event) => setField("doi", event.target.value)}
              placeholder="10.1000/xyz123"
            />
          </Field>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button onClick={generate}>
            <FileText className="size-4" aria-hidden="true" />
            Generate citation
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Missing information" description={error} /> : null}
      </div>

      <div className="space-y-4">
        <ToolOutput
          label={`${style === "apa" ? "APA 7" : "MLA 9"} reference`}
          value={citation}
          filename="citation.txt"
          rows={5}
          placeholder="Your formatted citation will appear here."
        />
        {inText ? (
          <div className="rounded-card border border-border bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">
              In-text citation
            </p>
            <p className="mt-2 font-mono text-lg text-foreground">{inText}</p>
          </div>
        ) : null}
        <p className="text-xs text-subtle-foreground">
          This generator follows common APA 7 and MLA 9 patterns for a single source. Always check
          your institution&apos;s style guide for unusual cases such as many authors or edited volumes.
        </p>
      </div>
    </div>
  );
}
