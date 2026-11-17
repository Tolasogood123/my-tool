"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, Grid2X2, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { MAX_IMAGE_UPLOAD_BYTES } from "@/constants/limits";
import { downloadBlob } from "@/lib/utils/download";
import { formatBytes } from "@/lib/utils/format";
import { loadImageFile } from "@/lib/utils/image";
import {
  PASSPORT_SIZES,
  photoCanvasToBlob,
  renderPassportPhoto,
  renderPrintSheet,
  validatePhotoImage,
  type PhotoRenderOptions,
} from "@/lib/utils/passport-photo";

const BACKGROUNDS = [
  { value: "#FFFFFF", label: "White" },
  { value: "#F0F0F0", label: "Light gray" },
  { value: "#EAF1F8", label: "Light blue" },
];

export function PassportPhotoMaker() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sheetCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [imageVersion, setImageVersion] = useState(0);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [sizeId, setSizeId] = useState(PASSPORT_SIZES[0].id);
  const [background, setBackground] = useState("#FFFFFF");
  const [zoom, setZoom] = useState(1);
  const [padding, setPadding] = useState(0);
  const [columns, setColumns] = useState(2);
  const [rows, setRows] = useState(4);
  const [paper, setPaper] = useState<"a4" | "letter">("a4");
  const [guides, setGuides] = useState(true);
  const [photoUrl, setPhotoUrl] = useState("");
  const [sheetUrl, setSheetUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const activeSize = PASSPORT_SIZES.find((item) => item.id === sizeId) ?? PASSPORT_SIZES[0];
  const photoOptions: PhotoRenderOptions = { background, zoom, padding };

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    try {
      const photo = renderPassportPhoto(image, activeSize, photoOptions);
      photoCanvasRef.current = photo;
      setPhotoUrl(photo.toDataURL("image/png"));

      const sheet = renderPrintSheet(image, activeSize, {
        ...photoOptions,
        columns,
        rows,
        paper,
        guides,
      });
      sheetCanvasRef.current = sheet;
      setSheetUrl(sheet.toDataURL("image/jpeg", 0.85));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not render the photo.");
    }
    // photoOptions is rebuilt each render; depend on its primitive members instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageVersion, sizeId, background, zoom, padding, columns, rows, paper, guides]);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = event.target.files?.[0] ?? null;
    setError(null);
    setPhotoUrl("");
    setSheetUrl("");
    setFileName("");
    setFileSize(0);
    imageRef.current = null;

    if (!chosen) return;
    const validationError = validatePhotoImage(chosen);
    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);
    try {
      const loadedImage = await loadImageFile(chosen);
      URL.revokeObjectURL(loadedImage.url);
      imageRef.current = loadedImage.image;
      setFileName(chosen.name);
      setFileSize(chosen.size);
      setImageVersion((version) => version + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not open that image.");
    } finally {
      setBusy(false);
    }
  };

  const downloadPhoto = async () => {
    const canvas = photoCanvasRef.current;
    if (!canvas) return;
    try {
      const blob = await photoCanvasToBlob(canvas);
      downloadBlob(blob, `${fileName.replace(/\.[^.]+$/, "") || "photo"}-passport.png`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not export the photo.");
    }
  };

  const downloadSheet = async () => {
    const canvas = sheetCanvasRef.current;
    if (!canvas) return;
    try {
      const blob = await photoCanvasToBlob(canvas);
      downloadBlob(blob, `passport-print-sheet-${paper}.png`);
      toast({ title: "Print sheet downloaded", variant: "success" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not export the print sheet.");
    }
  };

  const reset = () => {
    imageRef.current = null;
    photoCanvasRef.current = null;
    sheetCanvasRef.current = null;
    setFileName("");
    setFileSize(0);
    setSizeId(PASSPORT_SIZES[0].id);
    setBackground("#FFFFFF");
    setZoom(1);
    setPadding(0);
    setColumns(2);
    setRows(4);
    setPaper("a4");
    setGuides(true);
    setPhotoUrl("");
    setSheetUrl("");
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-accent/30 bg-surface p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Important:</strong> passport photo rules vary by
        country and change over time. This tool only crops and arranges your image — it cannot
        verify head size, background, expression or lighting. Always check your government&apos;s
        official requirements before printing or submitting a photo.
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <Field
            label="Portrait photo"
            htmlFor="passport-photo-file"
            hint={`JPG, PNG or WebP up to ${formatBytes(MAX_IMAGE_UPLOAD_BYTES)}. A front-facing portrait works best.`}
          >
            <Input
              id="passport-photo-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFileChange}
              className="h-auto py-2"
            />
          </Field>

          {fileName ? (
            <p className="text-xs text-subtle-foreground">
              {fileName} · {formatBytes(fileSize)}
            </p>
          ) : null}

          <Field label="Photo size" htmlFor="passport-size" hint="Pixel sizes are calibrated for 300 DPI printing.">
            <Select id="passport-size" value={sizeId} onChange={(event) => setSizeId(event.target.value)}>
              {PASSPORT_SIZES.map((size) => (
                <option key={size.id} value={size.id}>{size.label}</option>
              ))}
            </Select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={`Zoom: ${zoom.toFixed(1)}×`} htmlFor="passport-zoom">
              <input
                id="passport-zoom"
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="mt-3 w-full accent-[var(--accent)]"
              />
            </Field>
            <Field label={`Border: ${padding}%`} htmlFor="passport-padding">
              <input
                id="passport-padding"
                type="range"
                min={0}
                max={20}
                step={1}
                value={padding}
                onChange={(event) => setPadding(Number(event.target.value))}
                className="mt-3 w-full accent-[var(--accent)]"
              />
            </Field>
          </div>

          <Field label="Border fill color" htmlFor="passport-background">
            <div className="flex flex-wrap gap-2">
              {BACKGROUNDS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setBackground(option.value)}
                  aria-pressed={background === option.value}
                  className={`inline-flex items-center gap-2 rounded-control border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                    background === option.value
                      ? "border-accent bg-surface-muted text-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <span className="size-4 rounded-full border border-border" style={{ backgroundColor: option.value }} />
                  {option.label}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Sheet columns" htmlFor="passport-columns">
              <Input id="passport-columns" type="number" min={1} max={6} value={columns} onChange={(event) => setColumns(Number(event.target.value))} />
            </Field>
            <Field label="Sheet rows" htmlFor="passport-rows">
              <Input id="passport-rows" type="number" min={1} max={8} value={rows} onChange={(event) => setRows(Number(event.target.value))} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Paper" htmlFor="passport-paper">
              <Select id="passport-paper" value={paper} onChange={(event) => setPaper(event.target.value as "a4" | "letter")}>
                <option value="a4">A4</option>
                <option value="letter">US Letter</option>
              </Select>
            </Field>
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Cut guides</p>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={guides}
                  onChange={(event) => setGuides(event.target.checked)}
                  className="size-4 rounded border-border accent-[var(--accent)]"
                />
                Show dashed cut lines
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={downloadPhoto} disabled={!photoUrl}>
              <Download className="size-4" aria-hidden="true" />
              Download photo
            </Button>
            <Button variant="outline" onClick={downloadSheet} disabled={!sheetUrl}>
              <Grid2X2 className="size-4" aria-hidden="true" />
              Download print sheet
            </Button>
            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset
            </Button>
          </div>

          {busy ? <p className="text-xs text-subtle-foreground">Preparing your photo…</p> : null}
          {error ? (
            <ErrorState title="Could not make the photo" description={error} icon={Upload} />
          ) : null}
        </div>

        <div className="space-y-5">
          <div className="flex min-h-56 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-muted p-5">
            <h2 className="text-sm font-semibold">Single photo · {activeSize.label}</h2>
            {photoUrl ? (
              <div className="mt-4 overflow-hidden rounded-control border border-border bg-white">
                <Image
                  src={photoUrl}
                  alt="Cropped passport photo preview"
                  width={activeSize.widthPx}
                  height={activeSize.heightPx}
                  unoptimized
                  className="h-auto max-h-72 w-auto"
                />
              </div>
            ) : (
              <p className="mt-3 text-center text-sm text-muted-foreground">
                {activeSize.widthPx} × {activeSize.heightPx} px at 300 DPI. Upload a photo to preview.
              </p>
            )}
          </div>

          <div className="flex min-h-56 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-muted p-5">
            <h2 className="text-sm font-semibold">
              Print sheet · {columns} × {rows} on {paper === "a4" ? "A4" : "Letter"}
            </h2>
            {sheetUrl ? (
              <div className="mt-4 max-h-72 w-full overflow-hidden rounded-control border border-border bg-white">
                <Image
                  src={sheetUrl}
                  alt="Passport photo print sheet preview"
                  width={1000}
                  height={1414}
                  unoptimized
                  className="h-auto w-full object-contain"
                />
              </div>
            ) : (
              <p className="mt-3 text-center text-sm text-muted-foreground">
                A print-ready grid is generated automatically in your browser.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
