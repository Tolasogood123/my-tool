"use client";

import { useEffect, useRef, useState } from "react";
import { Fingerprint, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { useToast } from "@/components/ui/Toast";
import { formatBytes } from "@/lib/utils/format";
import {
  HASH_ALGORITHMS,
  hashFile,
  hashText,
  type HashAlgorithm,
} from "@/lib/utils/hash";

export function HashGenerator() {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [digest, setDigest] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const generate = async () => {
    setError(null);
    setDigest("");
    setBusy(true);
    try {
      const result = mode === "text"
        ? await hashText(text, algorithm)
        : await hashFile(file as File, algorithm);
      if (mounted.current) {
        setDigest(result);
        toast({ title: "Hash generated", variant: "success" });
      }
    } catch (cause) {
      if (mounted.current) setError(cause instanceof Error ? cause.message : "Could not compute the hash.");
    } finally {
      if (mounted.current) setBusy(false);
    }
  };

  const reset = () => {
    setText("");
    setFile(null);
    setDigest("");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Input type" htmlFor="hash-mode">
            <Select id="hash-mode" value={mode} onChange={(event) => { setMode(event.target.value as "text" | "file"); setDigest(""); setError(null); }}>
              <option value="text">Text</option>
              <option value="file">File</option>
            </Select>
          </Field>
          <Field label="Algorithm" htmlFor="hash-algorithm">
            <Select id="hash-algorithm" value={algorithm} onChange={(event) => setAlgorithm(event.target.value as HashAlgorithm)}>
              {HASH_ALGORITHMS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Select>
          </Field>
        </div>

        {mode === "text" ? (
          <Field label="Text to hash" htmlFor="hash-text">
            <Textarea
              id="hash-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type or paste text here…"
              className="font-mono text-xs"
            />
          </Field>
        ) : (
          <Field label="File" htmlFor="hash-file" hint="The file is read locally with the File Reader API and never uploaded.">
            <Input
              id="hash-file"
              type="file"
              onChange={(event) => { setFile(event.target.files?.[0] ?? null); setDigest(""); setError(null); }}
              className="h-auto py-2"
            />
          </Field>
        )}

        <div className="flex flex-wrap gap-3">
          <Button onClick={generate} disabled={busy || (mode === "text" ? !text : !file)} loading={busy}>
            <Fingerprint className="size-4" aria-hidden="true" />
            {busy ? "Hashing…" : "Generate hash"}
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Could not hash that input" description={error} icon={Upload} /> : null}
        {mode === "file" && file ? (
          <p className="text-xs text-subtle-foreground">{file.name} · {formatBytes(file.size)}</p>
        ) : null}
      </div>

      <ToolOutput
        label={`${algorithm} digest`}
        value={digest}
        rows={6}
        filename="hash.txt"
        placeholder="Your hexadecimal hash will appear here."
        onClear={() => setDigest("")}
      />
    </div>
  );
}
