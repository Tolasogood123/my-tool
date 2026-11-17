"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { formatBytes } from "@/lib/utils/format";
import { canvasToBlob, loadImageFile, type LoadedImage } from "@/lib/utils/image";
import {
  applyMatrixToImageData,
  COLOR_DEFICIENCIES,
  getMatrix,
  validateImageFile,
} from "@/lib/utils/color-blindness";

const MAX_DIMENSION = 2048;

export function ColorBlindnessSimulator() {
  const [file, setFile] = useState<File | null>(null);
  const [loaded, setLoaded] = useState<LoadedImage | null>(null);
  const [deficiencyId, setDeficiencyId] = useState(COLOR_DEFICIENCIES[0].id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const simulatedCanvasRef = useRef<HTMLCanvasElement>(null);
  const loadedUrlRef = useRef("");
  const outputUrlRef = useRef("");
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (loadedUrlRef.current) URL.revokeObjectURL(loadedUrlRef.current);
      if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const canvas = simulatedCanvasRef.current;
    if (!canvas) return;

    const scale = Math.min(1, MAX_DIMENSION / Math.max(loaded.width, loaded.height));
    const width = Math.max(1, Math.round(loaded.width * scale));
    const height = Math.max(1, Math.round(loaded.height * scale));
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    context.drawImage(loaded.image, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);
    applyMatrixToImageData(imageData, getMatrix(deficiencyId));
    context.putImageData(imageData, 0, 0);
  }, [loaded, deficiencyId]);

  const releaseOutput = () => {
    if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
    outputUrlRef.current = "";
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setError(null);
    releaseOutput();
    setLoaded(null);
    setFile(null);

    if (!selected) {
      if (loadedUrlRef.current) URL.revokeObjectURL(loadedUrlRef.current);
      loadedUrlRef.current = "";
      return;
    }

    const validationError = validateImageFile(selected);
    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);
    try {
      const result = await loadImageFile(selected);
      if (loadedUrlRef.current) URL.revokeObjectURL(loadedUrlRef.current);
      loadedUrlRef.current = result.url;
      setLoaded(result);
      setFile(selected);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not read that image.");
    } finally {
      setBusy(false);
    }
  };

  const download = async () => {
    const canvas = simulatedCanvasRef.current;
    if (!canvas || !loaded) return;
    setBusy(true);
    try {
      const blob = await canvasToBlob(canvas, "image/png");
      releaseOutput();
      outputUrlRef.current = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = outputUrlRef.current;
      const base = (file?.name ?? "image").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-");
      link.download = `${base || "image"}-${deficiencyId}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast({ title: "Simulation downloaded", variant: "success" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create the image.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    if (loadedUrlRef.current) URL.revokeObjectURL(loadedUrlRef.current);
    loadedUrlRef.current = "";
    releaseOutput();
    setFile(null);
    setLoaded(null);
    setError(null);
    setDeficiencyId(COLOR_DEFICIENCIES[0].id);
  };

  const active = COLOR_DEFICIENCIES.find((item) => item.id === deficiencyId);

  return (
    <div className="space-y-6">
      <Field
        label="Image"
        htmlFor="cvd-image"
        hint="JPEG, PNG, or WebP up to 20 MB. The image is processed locally and never uploaded. Large images are scaled down to a 2048 px canvas for the preview."
      >
        <Input
          id="cvd-image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onFileChange}
          className="h-auto py-2"
        />
      </Field>

      <fieldset>
        <legend className="text-sm font-medium">Deficiency to simulate</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {COLOR_DEFICIENCIES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={deficiencyId === item.id}
              onClick={() => setDeficiencyId(item.id)}
              className={`rounded-control border px-3 py-2 text-sm font-medium transition-colors ${
                deficiencyId === item.id
                  ? "border-accent bg-surface-muted text-foreground"
                  : "border-border bg-surface text-muted-foreground hover:border-border-strong"
              }`}
            >
              {item.short}
            </button>
          ))}
        </div>
        {active ? (
          <p className="mt-2 text-xs text-subtle-foreground">{active.description}</p>
        ) : null}
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <Button onClick={download} disabled={!loaded || busy} loading={busy}>
          <Download className="size-4" aria-hidden="true" />
          Download simulation
        </Button>
        <Button variant="ghost" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      {error ? (
        <ErrorState title="Could not process that image" description={error} icon={Upload} />
      ) : null}

      {loaded ? (
        <div className="grid gap-4 md:grid-cols-2">
          <figure className="space-y-2">
            <figcaption className="text-sm font-medium">Original</figcaption>
            <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-card border border-border bg-surface-muted p-3">
              <Image
                src={loaded.url}
                alt="Original uploaded image"
                width={loaded.width}
                height={loaded.height}
                unoptimized
                className="max-h-80 w-auto rounded-control object-contain"
              />
            </div>
          </figure>
          <figure className="space-y-2">
            <figcaption className="text-sm font-medium">
              Simulated: {active?.label ?? "None"}
            </figcaption>
            <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-card border border-border bg-surface-muted p-3">
              <canvas
                ref={simulatedCanvasRef}
                aria-label="Simulated color vision result"
                className="max-h-80 w-auto rounded-control object-contain"
              />
            </div>
            <p className="text-xs text-subtle-foreground">
              {file?.name} · {file ? formatBytes(file.size) : ""}
            </p>
          </figure>
        </div>
      ) : (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-muted p-5 text-center">
          <p className="text-sm text-muted-foreground">
            Choose an image and a deficiency type to see a before-and-after preview here.
          </p>
        </div>
      )}

    </div>
  );
}
