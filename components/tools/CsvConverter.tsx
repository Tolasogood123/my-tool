"use client";

import { useState } from "react";
import { Braces, RotateCcw, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { csvToJson, jsonToCsv } from "@/lib/utils/csv";
import type { Delimiter } from "@/lib/utils/csv";

interface CsvConverterProps {
  mode: "to-json" | "to-csv";
}

export function CsvConverter({ mode }: CsvConverterProps) {
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState<Delimiter>(",");
  const [headers, setHeaders] = useState(true);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const convert = () => {
    setError(null);

    if (isJson) {
      const result = csvToJson(input, delimiter, headers);
      if (result.error) {
        setOutput("");
        setError(result.error);
        return;
      }
      setOutput(result.json);
      return;
    }

    const result = jsonToCsv(input, delimiter);
    if (result.error) {
      setOutput("");
      setError(result.error);
      return;
    }
    setOutput(result.csv);
  };

  const reset = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const isJson = mode === "to-json";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label={isJson ? "CSV input" : "JSON input"}
          htmlFor="csv-source"
          hint={isJson ? "Quoted fields and line breaks inside quotes are supported." : "Provide an array of objects or an array of arrays."}
        >
          <Textarea
            id="csv-source"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={
              isJson
                ? 'name,age\n"Kim, Sokha",21'
                : '[{"name":"Kim","age":21}]'
            }
            className="min-h-64 font-mono text-xs leading-6"
          />
        </Field>

        <div className="flex flex-wrap items-end gap-4">
          <Field label="Delimiter" htmlFor="csv-delimiter">
            <Select
              id="csv-delimiter"
              value={delimiter}
              onChange={(event) => setDelimiter(event.target.value as Delimiter)}
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="\t">Tab</option>
            </Select>
          </Field>
          {isJson ? (
            <label className="flex items-center gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                checked={headers}
                onChange={(event) => setHeaders(event.target.checked)}
                className="size-4 accent-[var(--accent)]"
              />
              First row contains headers
            </label>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={convert}>
            <WandSparkles className="size-4" aria-hidden="true" />
            {isJson ? "Convert to JSON" : "Convert to CSV"}
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Conversion failed" description={error} icon={Braces} /> : null}
      </div>

      <ToolOutput
        label={isJson ? "JSON result" : "CSV result"}
        value={output}
        filename={isJson ? "converted.json" : "converted.csv"}
        mimeType={isJson ? "application/json;charset=utf-8" : "text/csv;charset=utf-8"}
        rows={12}
        onClear={() => setOutput("")}
      />
    </div>
  );
}
