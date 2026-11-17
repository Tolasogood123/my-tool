"use client";

import { useState } from "react";
import { Braces, RotateCcw, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { formatSql, type KeywordCase } from "@/lib/utils/sql";

export function SqlFormatter() {
  const [sql, setSql] = useState("");
  const [keywordCase, setKeywordCase] = useState<KeywordCase>("upper");
  const [indent, setIndent] = useState("2");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const format = () => {
    setError(null);
    if (!sql.trim()) {
      setError("Paste a SQL statement to format.");
      setOutput("");
      return;
    }
    try {
      setOutput(formatSql(sql, { keywordCase, indentSize: Number(indent) }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not format that SQL.");
    }
  };

  const reset = () => {
    setSql("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="SQL input" htmlFor="sql-input" hint="String literals, comments and quoted names are preserved.">
          <Textarea
            id="sql-input"
            value={sql}
            onChange={(event) => setSql(event.target.value)}
            placeholder={"select id, name, email from users where active = 1 and role = 'admin' order by name;"}
            className="font-mono text-xs"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Keyword case" htmlFor="sql-case">
            <Select id="sql-case" value={keywordCase} onChange={(event) => setKeywordCase(event.target.value as KeywordCase)}>
              <option value="upper">UPPERCASE</option>
              <option value="lowercase">lowercase</option>
              <option value="preserve">Preserve as typed</option>
            </Select>
          </Field>
          <Field label="Indent size (spaces)" htmlFor="sql-indent">
            <Input
              id="sql-indent"
              type="number"
              min={0}
              max={8}
              step="1"
              inputMode="numeric"
              value={indent}
              onChange={(event) => setIndent(event.target.value)}
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={format}>
            <WandSparkles className="size-4" aria-hidden="true" />
            Format SQL
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <p role="alert" className="text-sm font-medium text-danger">{error}</p> : null}
        <p className="flex items-center gap-2 text-xs text-subtle-foreground">
          <Braces className="size-4" aria-hidden="true" />
          Token-based formatting keeps your data safe and readable.
        </p>
      </div>

      <ToolOutput
        label="Formatted SQL"
        value={output}
        rows={16}
        filename="formatted.sql"
        mimeType="application/sql"
        placeholder="Formatted SQL will appear here."
        onClear={() => setOutput("")}
      />
    </div>
  );
}
