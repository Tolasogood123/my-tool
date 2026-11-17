"use client";

import { useEffect, useRef, useState } from "react";
import { Download, RotateCcw, Scissors, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { formatBytes } from "@/lib/utils/format";
import {
  MAX_AUDIO_UPLOAD_BYTES,
  decodeAudioFile,
  encodeWav,
  formatAudioTime,
  pcmDuration,
  safeAudioBaseName,
  trimAudioBuffer,
  validateAudioFile,
} from "@/lib/utils/audio-trimmer";

interface TrimOutput {
  url: string;
  filename: string;
  size: number;
  duration: number;
  sampleRate: number;
  channels: number;
}

export function AudioTrimmer() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [output, setOutput] = useState<TrimOutput | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sampleRate, setSampleRate] = useState<number | null>(null);

  const contextRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceUrlRef = useRef("");
  const outputUrlRef = useRef("");
  const loadTokenRef = useRef(0);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
      if (contextRef.current) void contextRef.current.close();
    };
  }, []);

  const releaseOutput = () => {
    if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
    outputUrlRef.current = "";
    setOutput(null);
  };

  const clearSource = () => {
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    sourceUrlRef.current = "";
    setSourceUrl("");
    bufferRef.current = null;
    setSampleRate(null);
    setFile(null);
    setDuration(0);
    setStart(0);
    setEnd(0);
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    const token = ++loadTokenRef.current;
    setError(null);
    releaseOutput();
    clearSource();

    if (!selected) return;
    const validationError = validateAudioFile(selected);
    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);
    try {
      if (!contextRef.current || contextRef.current.state === "closed") {
        contextRef.current = new AudioContext();
      }
      const buffer = await decodeAudioFile(contextRef.current, selected);
      if (token !== loadTokenRef.current) return;

      const url = URL.createObjectURL(selected);
      sourceUrlRef.current = url;
      setSourceUrl(url);
      bufferRef.current = buffer;
      setSampleRate(buffer.sampleRate);
      setFile(selected);
      setDuration(buffer.duration);
      setStart(0);
      setEnd(buffer.duration);
    } catch (cause) {
      if (token !== loadTokenRef.current) return;
      setError(
        cause instanceof Error
          ? `Could not decode this audio: ${cause.message}`
          : "This browser could not decode that audio file. Try an MP3 or WAV.",
      );
    } finally {
      if (token === loadTokenRef.current) setBusy(false);
    }
  };

  const trim = () => {
    const buffer = bufferRef.current;
    if (!buffer || !file) {
      setError("Choose an audio file first.");
      return;
    }
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      setError("The end time must be greater than the start time.");
      return;
    }
    if (start < 0 || end > buffer.duration + 0.001) {
      setError("Both times must fall within the audio length.");
      return;
    }

    setBusy(true);
    setError(null);
    let createdUrl = "";
    try {
      const pcm = trimAudioBuffer(buffer, start, end);
      const blob = encodeWav(pcm);
      createdUrl = URL.createObjectURL(blob);
      releaseOutput();
      outputUrlRef.current = createdUrl;
      setOutput({
        url: createdUrl,
        filename: `${safeAudioBaseName(file.name)}-trim.wav`,
        size: blob.size,
        duration: pcmDuration(pcm),
        sampleRate: pcm.sampleRate,
        channels: pcm.channels.length,
      });
      toast({ title: "Audio trimmed", variant: "success" });
    } catch (cause) {
      if (createdUrl) URL.revokeObjectURL(createdUrl);
      setError(cause instanceof Error ? cause.message : "Could not trim that audio.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    loadTokenRef.current++;
    if (contextRef.current) {
      void contextRef.current.close();
      contextRef.current = null;
    }
    releaseOutput();
    clearSource();
    setError(null);
    setBusy(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="Audio file"
          htmlFor="trim-audio"
          hint={`MP3, WAV or OGG up to ${formatBytes(MAX_AUDIO_UPLOAD_BYTES)}. The file stays on your device.`}
        >
          <Input
            id="trim-audio"
            type="file"
            accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,.mp3,.wav,.ogg"
            onChange={onFileChange}
            className="h-auto py-2"
          />
        </Field>

        {file ? (
          <div className="rounded-card border border-border bg-surface p-4">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatBytes(file.size)} · {formatAudioTime(duration)} · {sampleRate?.toLocaleString() ?? "—"} Hz
            </p>
            <audio controls src={sourceUrl} className="mt-3 w-full" preload="metadata" />
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start (seconds)" htmlFor="trim-start" hint={formatAudioTime(start)}>
            <Input
              id="trim-start"
              type="number"
              min={0}
              max={duration}
              step={0.1}
              value={start}
              disabled={!file}
              onChange={(event) => setStart(Number(event.target.value))}
            />
          </Field>
          <Field label="End (seconds)" htmlFor="trim-end" hint={formatAudioTime(end)}>
            <Input
              id="trim-end"
              type="number"
              min={0}
              max={duration}
              step={0.1}
              value={end}
              disabled={!file}
              onChange={(event) => setEnd(Number(event.target.value))}
            />
          </Field>
        </div>

        <Field label="Trim range" htmlFor="trim-range-hint" hint="Drag to set the start and end points on the timeline.">
          <div className="space-y-3">
            <input
              aria-label="Start time slider"
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={start}
              disabled={!file || duration === 0}
              onChange={(event) => {
                const value = Number(event.target.value);
                setStart(value);
                if (value >= end) setEnd(Math.min(duration, value + 0.1));
              }}
              className="w-full accent-[var(--accent)]"
            />
            <input
              id="trim-range-hint"
              aria-label="End time slider"
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={end}
              disabled={!file || duration === 0}
              onChange={(event) => {
                const value = Number(event.target.value);
                setEnd(value);
                if (value <= start) setStart(Math.max(0, value - 0.1));
              }}
              className="w-full accent-[var(--accent)]"
            />
          </div>
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button onClick={trim} disabled={!file || busy} loading={busy}>
            <Scissors className="size-4" aria-hidden="true" />
            Trim audio
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (!output) return;
              const link = document.createElement("a");
              link.href = output.url;
              link.download = output.filename;
              document.body.appendChild(link);
              link.click();
              link.remove();
            }}
            disabled={!output}
          >
            <Download className="size-4" aria-hidden="true" />
            Download WAV
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Could not trim audio" description={error} icon={Upload} /> : null}
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-muted p-5">
        {output ? (
          <div className="w-full space-y-3">
            <audio controls src={output.url} className="w-full" preload="metadata" />
            <p className="text-center text-xs text-muted-foreground">
              {output.filename} · {formatBytes(output.size)} · {formatAudioTime(output.duration)} ·{" "}
              {output.sampleRate.toLocaleString()} Hz · {output.channels} channel
              {output.channels === 1 ? "" : "s"}
            </p>
            <p className="text-center text-xs text-subtle-foreground">
              Exported as 16-bit PCM WAV.
            </p>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Load an audio file, choose a start and end time, then trim it into a WAV here.
          </p>
        )}
      </div>
    </div>
  );
}
