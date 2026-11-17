"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, Image as ImageIcon, RotateCcw, RotateCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { formatBytes } from "@/lib/utils/format";
import { downloadBlob } from "@/lib/utils/download";
import {
  rotateImage,
  validateImageFile,
  type RotateDegrees,
  type RotatedImage,
} from "@/lib/utils/image-rotator";

export function ImageRotator() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [degrees, setDegrees] = useState<RotateDegrees>(90);
  const [result, setResult] = useState<RotatedImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sourceUrlRef = useRef("");
  const resultUrlRef = useRef("");
  const mounted = useRef(true);
  const { toast } = useToast();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const releaseResult = () => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
    setResult(null);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setError(null);
    releaseResult();
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    sourceUrlRef.current = "";
    setSourceUrl("");

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
    setSourceUrl(url);
    setFile(selected);
  };

  const rotate = async () => {
    if (!file) {
      setError("Choose an image first.");
      return;
    }
    setBusy(true);
    setError(null);
    let created = "";
    try {
      const output = await rotateImage(file, degrees);
      created = output.url;
      releaseResult();
      resultUrlRef.current = output.url;
      setResult(output);
      toast({ title: `Rotated ${degrees}°`, variant: "success" });
    } catch (cause) {
      if (created) URL.revokeObjectURL(created);
      if (mounted.current) setError(cause instanceof Error ? cause.message : "Could not rotate that image.");
    } finally {
      if (mounted.current) setBusy(false);
    }
  };

  const download = () => {
    if (!result) return;
    downloadBlob(result.blob, result.filename);
  };

  const reset = () => {
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    sourceUrlRef.current = "";
    releaseResult();
    setFile(null);
    setSourceUrl("");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Image file" htmlFor="rotate-file" hint="JPEG, PNG or WebP up to 20 MB. Your image stays on your device.">
          <Input id="rotate-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange} className="h-auto py-2" />
        </Field>
        <Field label="Rotation" htmlFor="rotate-degrees">
          <Select id="rotate-degrees" value={degrees} onChange={(event) => setDegrees(Number(event.target.value) as RotateDegrees)}>
            <option value={90}>90° clockwise</option>
            <option value={180}>180°</option>
            <option value={270}>270° clockwise</option>
          </Select>
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button onClick={rotate} disabled={!file || busy} loading={busy}>
            <RotateCw className="size-4" aria-hidden="true" />
            {busy ? "Rotating…" : "Rotate image"}
          </Button>
          <Button variant="outline" onClick={download} disabled={!result}>
            <Download className="size-4" aria-hidden="true" />
            Download
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Could not rotate image" description={error} icon={Upload} /> : null}
        {file ? <p className="text-xs text-subtle-foreground">{file.name} · {formatBytes(file.size)}</p> : null}

        {sourceUrl ? (
          <div className="flex flex-col items-center rounded-card border border-border bg-surface-muted p-4">
            <p className="mb-2 text-xs text-muted-foreground">Original</p>
            <Image src={sourceUrl} alt="Original image preview" width={320} height={200} unoptimized className="max-h-48 w-auto rounded-control object-contain" />
          </div>
        ) : null}
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface p-5">
        {result ? (
          <>
            <Image src={result.url} alt={`Image rotated ${result.degrees} degrees`} width={400} height={300} unoptimized className="max-h-80 w-auto rounded-control border border-border object-contain" />
            <p className="mt-3 text-xs text-muted-foreground">
              {result.width} × {result.height} px · {formatBytes(result.blob.size)}
            </p>
          </>
        ) : (
          <div className="text-center">
            <ImageIcon className="mx-auto size-7 text-subtle-foreground" aria-hidden="true" />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Choose an image and a rotation angle. The rotated PNG preview will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
