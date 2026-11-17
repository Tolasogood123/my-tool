"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, Film, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { MAX_VIDEO_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";
import {
  captureFrame,
  formatVideoTime,
  seekVideo,
  validateVideoFile,
} from "@/lib/utils/video-thumbnail";

interface Capture {
  url: string;
  filename: string;
  size: number;
}

export function VideoThumbnailExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png");
  const [quality, setQuality] = useState("0.9");
  const [capture, setCapture] = useState<Capture | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const sourceUrlRef = useRef("");
  const captureUrlRef = useRef("");
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      if (captureUrlRef.current) URL.revokeObjectURL(captureUrlRef.current);
    };
  }, []);

  const releaseCapture = () => {
    if (captureUrlRef.current) URL.revokeObjectURL(captureUrlRef.current);
    captureUrlRef.current = "";
    setCapture(null);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setError(null);
    releaseCapture();
    setDuration(0);
    setTime(0);

    if (!selected) {
      setFile(null);
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      sourceUrlRef.current = "";
      setSourceUrl("");
      return;
    }

    const validationError = validateVideoFile(selected);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }

    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    const url = URL.createObjectURL(selected);
    sourceUrlRef.current = url;
    setSourceUrl(url);
    setFile(selected);
  };

  const extract = async () => {
    const video = videoRef.current;
    if (!video || !file) {
      setError("Choose a video first.");
      return;
    }
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      setError("The video metadata is still loading. Try again in a moment.");
      return;
    }

    setBusy(true);
    setError(null);
    let createdUrl = "";
    try {
      await seekVideo(video, time);
      const output = await captureFrame(
        video,
        format,
        Number(quality),
        file.name,
      );
      createdUrl = output.url;
      releaseCapture();
      captureUrlRef.current = output.url;
      setCapture({
        url: output.url,
        filename: output.filename,
        size: output.blob.size,
      });
      toast({ title: "Frame extracted", variant: "success" });
    } catch (cause) {
      if (createdUrl) URL.revokeObjectURL(createdUrl);
      setError(cause instanceof Error ? cause.message : "Could not extract that frame.");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!capture) return;
    const link = document.createElement("a");
    link.href = capture.url;
    link.download = capture.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const reset = () => {
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    sourceUrlRef.current = "";
    releaseCapture();
    setFile(null);
    setSourceUrl("");
    setDuration(0);
    setTime(0);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="Video file"
          htmlFor="thumbnail-video"
          hint={`MP4, WebM, OGG or MOV up to ${formatBytes(MAX_VIDEO_UPLOAD_BYTES)}. The file stays on your device.`}
        >
          <Input
            id="thumbnail-video"
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.ogv,.mov"
            onChange={onFileChange}
            className="h-auto py-2"
          />
        </Field>

        {sourceUrl ? (
          <div className="overflow-hidden rounded-card border border-border bg-surface">
            <video
              ref={videoRef}
              src={sourceUrl}
              controls
              preload="metadata"
              className="max-h-72 w-full bg-black"
              onLoadedMetadata={(event) => {
                const video = event.currentTarget;
                setDuration(Number.isFinite(video.duration) ? video.duration : 0);
                setTime(0);
              }}
              onError={() => setError("This browser could not open that video. Try MP4 or WebM.")}
            />
          </div>
        ) : null}

        <Field
          label={`Frame position: ${formatVideoTime(time)}`}
          htmlFor="thumbnail-time"
          hint={duration ? `Total length ${formatVideoTime(duration)}.` : "Load a video to enable the timeline."}
        >
          <input
            id="thumbnail-time"
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={time}
            onChange={(event) => setTime(Number(event.target.value))}
            disabled={!file || duration === 0}
            className="w-full accent-[var(--accent)]"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Image format" htmlFor="thumbnail-format">
            <Select
              id="thumbnail-format"
              value={format}
              onChange={(event) => setFormat(event.target.value as "image/png" | "image/jpeg")}
            >
              <option value="image/png">PNG (lossless)</option>
              <option value="image/jpeg">JPEG (smaller)</option>
            </Select>
          </Field>
          {format === "image/jpeg" ? (
            <Field label={`Quality: ${Math.round(Number(quality) * 100)}%`} htmlFor="thumbnail-quality">
              <input
                id="thumbnail-quality"
                type="range"
                min={0.1}
                max={1}
                step={0.01}
                value={quality}
                onChange={(event) => setQuality(event.target.value)}
                className="mt-3 w-full accent-[var(--accent)]"
              />
            </Field>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={extract} disabled={!file || busy}>
            <Film className="size-4" aria-hidden="true" />
            {busy ? "Extracting…" : "Extract frame"}
          </Button>
          <Button variant="outline" onClick={download} disabled={!capture}>
            <Download className="size-4" aria-hidden="true" />
            Download
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Could not extract a frame" description={error} icon={Upload} /> : null}
        {file ? (
          <p className="text-xs text-subtle-foreground">
            {file.name} · {formatBytes(file.size)}
          </p>
        ) : null}
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-muted p-5">
        {capture ? (
          <>
            <Image
              src={capture.url}
              alt="Extracted video frame"
              width={480}
              height={270}
              unoptimized
              className="max-h-80 w-auto rounded-control border border-border object-contain"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              {capture.filename} · {formatBytes(capture.size)}
            </p>
          </>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Choose a video, pick a moment on the timeline, then extract a frame here.
          </p>
        )}
      </div>
    </div>
  );
}
