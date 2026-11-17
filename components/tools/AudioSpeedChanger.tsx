"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Gauge, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { formatBytes } from "@/lib/utils/format";
import {
  MAX_AUDIO_UPLOAD_BYTES,
  audioBufferToPcm,
  changeSpeed,
  decodeAudioFile,
  encodeWav,
  formatAudioTime,
  pcmDuration,
  safeAudioBaseName,
  validateAudioFile,
  type PcmData,
} from "@/lib/utils/audio-speed-changer";

interface SpeedOutput {
  url: string;
  filename: string;
  size: number;
  duration: number;
}

const PRESETS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function AudioSpeedChanger() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1.25);
  const [pcm, setPcm] = useState<PcmData | null>(null);
  const [output, setOutput] = useState<SpeedOutput | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contextRef = useRef<AudioContext | null>(null);
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
    setPcm(null);
    setFile(null);
    setDuration(0);
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
      setFile(selected);
      setDuration(buffer.duration);
      setPcm(audioBufferToPcm(buffer));
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

  const changeTempo = () => {
    if (!pcm || !file) {
      setError("Choose an audio file first.");
      return;
    }
    if (!Number.isFinite(speed) || speed <= 0) {
      setError("Speed must be greater than zero.");
      return;
    }
    setBusy(true);
    setError(null);
    let createdUrl = "";
    try {
      const resampled = changeSpeed(pcm, speed);
      const blob = encodeWav(resampled);
      createdUrl = URL.createObjectURL(blob);
      releaseOutput();
      outputUrlRef.current = createdUrl;
      setOutput({
        url: createdUrl,
        filename: `${safeAudioBaseName(file.name)}-${String(speed).replace(".", "-")}x.wav`,
        size: blob.size,
        duration: pcmDuration(resampled),
      });
      toast({ title: "Tempo changed", variant: "success" });
    } catch (cause) {
      if (createdUrl) URL.revokeObjectURL(createdUrl);
      setError(cause instanceof Error ? cause.message : "Could not change that audio's speed.");
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
    setSpeed(1.25);
    setError(null);
    setBusy(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="Audio file"
          htmlFor="speed-audio"
          hint={`MP3, WAV or OGG up to ${formatBytes(MAX_AUDIO_UPLOAD_BYTES)}. The file stays on your device.`}
        >
          <Input
            id="speed-audio"
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
              {formatBytes(file.size)} · {formatAudioTime(duration)} original
            </p>
            <audio controls src={sourceUrl} className="mt-3 w-full" preload="metadata" />
          </div>
        ) : null}

        <Field
          label={`Speed: ${speed.toFixed(2)}x`}
          htmlFor="speed-value"
          hint={`Estimated output length: ${formatAudioTime(duration / (speed || 1))}.`}
        >
          <div className="space-y-3">
            <input
              id="speed-value"
              type="range"
              min={0.25}
              max={2}
              step={0.05}
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              className="w-full accent-[var(--accent)]"
            />
            <Input
              aria-label="Speed multiplier"
              type="number"
              min={0.25}
              max={2}
              step={0.05}
              value={speed}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (Number.isFinite(value)) setSpeed(Math.max(0.25, Math.min(2, value)));
              }}
            />
          </div>
        </Field>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Speed presets">
          {PRESETS.map((preset) => (
            <Button
              key={preset}
              size="sm"
              variant={speed === preset ? "primary" : "outline"}
              onClick={() => setSpeed(preset)}
            >
              {preset}x
            </Button>
          ))}
        </div>

        <p className="rounded-control border border-border bg-surface-muted p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">About pitch:</strong> this tool resamples the audio,
          so pitch changes with speed. Faster playback sounds higher and slower playback sounds
          lower, like adjusting tape speed. No pitch correction is applied, so voices may sound
          unnaturally high or deep at extreme settings.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button onClick={changeTempo} disabled={!pcm || busy} loading={busy}>
            <Gauge className="size-4" aria-hidden="true" />
            Change speed
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

        {error ? <ErrorState title="Could not change speed" description={error} icon={Upload} /> : null}
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-muted p-5">
        {output ? (
          <div className="w-full space-y-3">
            <audio controls src={output.url} className="w-full" preload="metadata" />
            <p className="text-center text-xs text-muted-foreground">
              {output.filename} · {formatBytes(output.size)} · {formatAudioTime(output.duration)}
            </p>
            <p className="text-center text-xs text-subtle-foreground">
              Resampled and exported as 16-bit PCM WAV. Pitch shifts with tempo.
            </p>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Load a file, choose a speed, then listen to the resampled result here.
          </p>
        )}
      </div>
    </div>
  );
}
