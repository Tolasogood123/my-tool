"use client";

import { useMemo, useState } from "react";
import { Braces, Plus, RotateCcw, Shuffle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  MAX_MOCK_ROWS,
  MOCK_FIELD_TYPES,
  createSchemaField,
  generateMockData,
  mockDataToJson,
} from "@/lib/utils/mock-json";
import type { SchemaField } from "@/lib/utils/mock-json";

function defaultFields(): SchemaField[] {
  return [
    { name: "id", type: "uuid", enumValues: [] },
    { name: "name", type: "name", enumValues: [] },
    { name: "email", type: "email", enumValues: [] },
    { name: "active", type: "boolean", enumValues: [] },
    { name: "role", type: "enum", enumValues: ["admin", "editor", "viewer"] },
    { name: "createdAt", type: "date", enumValues: [] },
  ];
}

export function MockJsonGenerator() {
  const [fields, setFields] = useState<SchemaField[]>(defaultFields);
  const [count, setCount] = useState(10);
  const [seed, setSeed] = useState(42);

  const result = useMemo(() => generateMockData(fields, count, seed), [fields, count, seed]);
  const json = result.error ? "" : mockDataToJson(result.data);

  const updateField = (index: number, patch: Partial<SchemaField>) =>
    setFields((current) =>
      current.map((field, i) => (i === index ? { ...field, ...patch } : field)),
    );

  const addField = () => setFields((current) => [...current, createSchemaField(`field${current.length + 1}`)]);

  const removeField = (index: number) =>
    setFields((current) => current.filter((_, i) => i !== index));

  const reset = () => {
    setFields(defaultFields());
    setCount(10);
    setSeed(42);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">Schema fields ({fields.length})</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={addField}>
              <Plus className="size-3.5" aria-hidden="true" />
              Add field
            </Button>
            <Button size="sm" variant="ghost" onClick={reset}>
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Reset
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={index} className="rounded-control border border-border bg-surface p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  aria-label={`Field ${index + 1} name`}
                  value={field.name}
                  onChange={(event) => updateField(index, { name: event.target.value })}
                  placeholder="fieldName"
                  className="min-w-0 flex-1 font-mono text-xs"
                />
                <Select
                  aria-label={`Field ${index + 1} type`}
                  value={field.type}
                  onChange={(event) =>
                    updateField(index, { type: event.target.value as SchemaField["type"] })
                  }
                  className="min-w-0 flex-1"
                >
                  {MOCK_FIELD_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Remove field ${index + 1}`}
                  onClick={() => removeField(index)}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
              {field.type === "enum" ? (
                <Input
                  aria-label={`Field ${index + 1} enum options`}
                  value={field.enumValues.join(", ")}
                  onChange={(event) =>
                    updateField(index, {
                      enumValues: event.target.value.split(",").map((value) => value.trim()),
                    })
                  }
                  placeholder="admin, editor, viewer"
                  className="mt-2 font-mono text-xs"
                />
              ) : null}
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={`Row count: ${count}`}
            htmlFor="mock-count"
            hint={`Between 1 and ${MAX_MOCK_ROWS} rows.`}
          >
            <input
              id="mock-count"
              type="range"
              min={1}
              max={MAX_MOCK_ROWS}
              step={1}
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
              className="mt-3 w-full accent-[var(--accent)]"
            />
          </Field>
          <Field label="Seed" htmlFor="mock-seed" hint="Same seed reproduces the same rows.">
            <div className="flex gap-2">
              <Input
                id="mock-seed"
                type="number"
                value={seed}
                onChange={(event) => setSeed(Number(event.target.value) || 0)}
                className="min-w-0 flex-1"
              />
              <Button
                size="icon"
                variant="outline"
                aria-label="Randomize seed"
                onClick={() => setSeed(Math.floor(Math.random() * 1_000_000))}
              >
                <Shuffle className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </Field>
        </div>

        {result.error ? (
          <ErrorState title="Check your schema" description={result.error} icon={Braces} />
        ) : null}
      </div>

      <div className="space-y-4">
        <ToolOutput
          label="Generated JSON"
          value={json}
          filename="mock-data.json"
          mimeType="application/json;charset=utf-8"
          rows={16}
          placeholder="Your mock data will appear here."
        />
        <p className="text-xs text-subtle-foreground">
          All values are deliberately fake: emails use the reserved{" "}
          <code className="font-mono">example.test</code> domain and names are placeholders. Safe
          for demos and tests, never for production data.
        </p>
      </div>
    </div>
  );
}
