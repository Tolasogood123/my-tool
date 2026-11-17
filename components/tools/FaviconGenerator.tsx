"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, ImageDown, RotateCcw, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { formatBytes } from "@/lib/utils/format";
import { downloadBlob } from "@/lib/utils/download";
import { validateImageFile } from "@/lib/utils/image-rotator";
import {
  generateFavicon,
  type FaviconResult,
} from "@/lib/utils/favicon";

export function FaviconGenerator() {
  const [mode, setMode] = useState<"emoji" | "image">("emoji");
  const [emoji, setEmoji] = useState("🚀");
  const [background, setBackground] = useState("#4f46e5");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<FaviconResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sourceUrlRef = useRef("");
  const resultUrlsRef = useRef<string[]>([]);
  const mounted = useRef(true);
  const { toast } = useToast();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      resultUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const releaseResult = () => {
    resultUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    resultUrlsRef.current = [];
    setResult(null);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setError(null);
    releaseResult();
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    sourceUrlRef.current = "";

    if (!selected) {
      setFile(null);
      return;
    }
    const validation = validateImageFile(selected);
    if (validation) {
      setError(validation);
      setFile(null);
      return;
    }
    const url = URL.createObjectURL(selected);
    sourceUrlRef.current = url;
    setFile(selected);
  };

  const generate = async () => {
    setError(null);
    setBusy(true);
    const created: string[] = [];
    try {
      const source = mode === "emoji"
        ? { kind: "emoji" as const, emoji, background }
        : { kind: "image" as const, file: file as File };
      if (mode === "image" && !file) throw new Error("Choose an image first.");
      const output = await generateFavicon(source);
      created.push(...output.pngs.map((icon) => icon.url));
      if (output.ico) created.push(output.ico.url);
      releaseResult();
      resultUrlsRef.current = created;
      setResult(output);
      toast({ title: "Favicons generated", variant: "success" });
    } catch (cause) {
      created.forEach((url) => URL.revokeObjectURL(url));
      if (mounted.current) setError(cause instanceof Error ? cause.message : "Could not generate favicons.");
    } finally {
      if (mounted.current) setBusy(false);
    }
  };

  const reset = () => {
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    sourceUrlRef.current = "";
    releaseResult();
    setMode("emoji");
    setEmoji("🚀");
    setBackground("#4f46e5");
    setFile(null);
    setError(null);
  };

  const preview = result?.pngs.find((icon) => icon.size === 48) ?? result?.pngs[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <Field label="Source" htmlFor="favicon-mode">
            <Select id="favicon-mode" value={mode} onChange={(event) => { setMode(event.target.value as "emoji" | "image"); setError(null); }}>
              <option value="emoji">Emoji</option>
              <option value="image">Image</option>
            </Select>
          </Field>

          {mode === "emoji" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Emoji" htmlFor="favicon-emoji">
                <Input id="favicon-emoji" value={emoji} onChange={(event) => setEmoji(event.target.value)} placeholder="🚀" />
              </Field>
              <Field label="Background color" htmlFor="favicon-background">
                <Input id="favicon-background" type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="h-10 p-1" />
              </Field>
            </div>
          ) : (
            <Field label="Image file" htmlFor="favicon-file" hint="Square images work best; non-square images are centre-cropped. JPEG, PNG or WebP up to 20 MB.">
              <Input id="favicon-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange} className="h-auto py-2" />
            </Field>
          )}

          <div className="flex flex-wrap gap-3">
            <Button onClick={generate} disabled={busy} loading={busy}>
              <Sparkles className="size-4" aria-hidden="true" />
              {busy ? "Generating…" : "Generate favicons"}
            </Button>
            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset
            </Button>
          </div>

          {error ? <ErrorState title="Could not generate favicons" description={error} icon={Upload} /> : null}
          {mode === "image" && file ? <p className="text-xs text-subtle-foreground">{file.name} · {formatBytes(file.size)}</p> : null}
        </div>

        <div className="flex min-h-64 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface p-5 text-center">
          {preview ? (
            <>
              <Image src={preview.url} alt="Favicon preview" width={96} height={96} unoptimized className="rounded-control border border-border" />
              <p className="mt-3 text-sm text-muted-foreground">Favicon preview at 48 × 48 px</p>
            </>
          ) : (
            <>
              <ImageDown className="mx-auto size-7 text-subtle-foreground" aria-hidden="true" />
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                Generate a favicon from an emoji or an image, then download PNG sizes and an ICO file.
              </p>
            </>
          )}
        </div>
      </div>

      {result ? (
        <div className="rounded-card border border-border bg-surface p-5">
          <h3 className="text-sm font-semibold">Downloads</h3>
          <div className="mt-4 flex flex-wrap gap-4">
            {result.pngs.map((icon) => (
              <div key={icon.size} className="flex flex-col items-center gap-2 rounded-control border border-border bg-surface-muted p-3">
                <Image src={icon.url} alt={`Favicon ${icon.size}px`} width={icon.size} height={icon.size} unoptimized className="rounded border border-border" />
                <span className="text-xs text-muted-foreground">{icon.size}×{icon.size}</span>
                <Button size="sm" variant="outline" onClick={() => downloadBlob(icon.blob, icon.filename)}>
                  <Download className="size-3.5" aria-hidden="true" /> PNG
                </Button>
              </div>
            ))}
            {result.ico ? (
              <div className="flex flex-col items-center justify-between gap-2 rounded-control border border-border bg-surface-muted p-3">
                <Image src={result.ico.url} alt="ICO favicon preview" width={48} height={48} unoptimized className="rounded border border-border" />
                <span className="text-xs text-muted-foreground">favicon.ico</span>
                <Button size="sm" variant="outline" onClick={() => downloadBlob(result.ico!.blob, result.ico!.filename)}>
                  <Download className="size-3.5" aria-hidden="true" /> ICO
                </Button>
              </div>
            ) : null}
          </div>
          <p className="mt-4 text-xs text-subtle-foreground">
            {result.ico ? `ICO packs 16, 32 and 48 px PNG images (${formatBytes(result.ico.blob.size)}).` : "No ICO sizes were available."}
            Emoji rendering depends on your device font.
          </p>
        </div>
      ) : null}
    </div>
  );
}
