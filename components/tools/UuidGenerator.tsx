"use client";

import { useState } from "react";
import { Fingerprint, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";

export function UuidGenerator() {
  const [count, setCount] = useState("10");
  const [caseStyle, setCaseStyle] = useState<"lower" | "upper">("lower");
  const [values, setValues] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generate = () => {
    setError(null);
    const amount = Number(count);

    if (!Number.isInteger(amount) || amount < 1 || amount > 100) {
      setError("Choose a count between 1 and 100.");
      return;
    }
    if (typeof crypto?.randomUUID !== "function") {
      setError("This browser does not support crypto.randomUUID. Try a modern browser over HTTPS.");
      return;
    }

    const generated = Array.from({ length: amount }, () => crypto.randomUUID());
    setValues(
      caseStyle === "upper"
        ? generated.map((value) => value.toUpperCase())
        : generated,
    );
  };

  const reset = () => {
    setValues([]);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="How many UUIDs?" htmlFor="uuid-count" hint="1 to 100.">
            <Input
              id="uuid-count"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(event) => setCount(event.target.value)}
            />
          </Field>
          <Field label="Letter case" htmlFor="uuid-case">
            <Select
              id="uuid-case"
              value={caseStyle}
              onChange={(event) => setCaseStyle(event.target.value as "lower" | "upper")}
            >
              <option value="lower">lowercase</option>
              <option value="upper">UPPERCASE</option>
            </Select>
          </Field>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={generate}>
            <Fingerprint className="size-4" aria-hidden="true" />
            Generate
          </Button>
          {values.length > 0 ? (
            <Button variant="outline" onClick={generate}>
              <RefreshCw className="size-4" aria-hidden="true" />
              New set
            </Button>
          ) : null}
          <Button variant="ghost" onClick={reset}>
            Clear
          </Button>
        </div>

        {error ? <ErrorState title="Could not generate UUIDs" description={error} /> : null}
        {values.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            Generated {values.length} random version 4 UUIDs in your browser.
          </p>
        ) : null}
      </div>

      <ToolOutput
        label="Generated UUIDs"
        value={values.join("\n")}
        filename="uuids.txt"
        rows={12}
        onClear={() => setValues([])}
      />
    </div>
  );
}
