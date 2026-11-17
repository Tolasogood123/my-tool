"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, RotateCcw, TrendingUp, Upload, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { formatBytes } from "@/lib/utils/format";
import {
  MAX_AUDIO_UPLOAD_BYTES,
  analyzeGain,
  applyGain,
  audioBufferToPcm,
  decodeAudioFile,
  encodeWav,
  formatAudioTime,
  pcmDuration,
  safeAudioBaseName,
  validateAudioFile,
  type PcmData,
} from "@/lib/utils/audio-volume-booster";

interface BoostOutput {
  url: string;
  filename: string;
  size: number;
  duration: number;
}

export function AudioVolumeBooster() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [gain, setGain] = useState(1.5);
  const [pcm, setPcm] = useState<PcmData | null>(null);
  const [output, setOutput] = useState<BoostOutput | null>(null);
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

  const analysis = useMemo(
    () => (pcm ? analyzeGain(pcm, gain) : null),
    [pcm, gain],
  );

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

  const boost = () => {
    if (!pcm || !file) {
      setError("Choose an audio file first.");
      return;
    }
    setBusy(true);
    setError(null);
    let createdUrl = "";
    try {
      const boosted = applyGain(pcm, gain);
      const blob = encodeWav(boosted);
      createdUrl = URL.createObjectURL(blob);
      releaseOutput();
      outputUrlRef.current = createdUrl;
      setOutput({
        url: createdUrl,
        filename: `${safeAudioBaseName(file.name)}-boosted.wav`,
        size: blob.size,
        duration: pcmDuration(boosted),
      });
      toast({ title: "Volume boosted", variant: "success" });
    } catch (cause) {
      if (createdUrl) URL.revokeObjectURL(createdUrl);
      setError(cause instanceof Error ? cause.message : "Could not boost that audio.");
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
    setGain(1.5);
    setError(null);
    setBusy(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="Audio file"
          htmlFor="boost-audio"
          hint={`MP3, WAV or OGG up to ${formatBytes(MAX_AUDIO_UPLOAD_BYTES)}. The file stays on your device.`}
        >
          <Input
            id="boost-audio"
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
              {formatBytes(file.size)} · {formatAudioTime(duration)}
            </p>
            <audio controls src={sourceUrl} className="mt-3 w-full" preload="metadata" />
          </div>
        ) : null}

        <Field
          label={`Gain: ${gain.toFixed(2)}x`}
          htmlFor="boost-gain"
          hint="1.0x is unchanged. 2.0x doubles amplitude (about +6 dB). Levels above 1.0 can clip."
        >
          <div className="space-y-3">
            <input
              id="boost-gain"
              type="range"
              min={0.1}
              max={4}
              step={0.05}
              value={gain}
              onChange={(event) => setGain(Number(event.target.value))}
              className="w-full accent-[var(--accent)]"
            />
            <Input
              aria-label="Gain multiplier"
              type="number"
              min={0.1}
              max={4}
              step={0.05}
              value={gain}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (Number.isFinite(value)) setGain(Math.max(0.1, Math.min(4, value)));
              }}
            />
          </div>
        </Field>

        {analysis ? (
          <div className="space-y-2 rounded-control border border-border bg-surface-muted p-4 text-sm">
            <p className="text-muted-foreground">
              Original peak: <span className="font-medium text-foreground">{analysis.peakDb.toFixed(1)} dBFS</span>
            </p>
            {analysis.clippedSamples > 0 ? (
              <p role="alert" className="font-medium text-danger">
                Clipping warning: {analysis.clippedSamples.toLocaleString()} of{" "}
                {analysis.totalSamples.toLocaleString()} samples would exceed 0 dBFS at this gain. Lower the gain to avoid distortion.
              </p>
            ) : (
              <p className="text-success">No clipping detected at this gain.</p>
            )}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button onClick={boost} disabled={!pcm || busy} loading={busy}>
            <TrendingUp className="size-4" aria-hidden="true" />
            Boost volume
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

        {error ? <ErrorState title="Could not boost audio" description={error} icon={Upload} /> : null}
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-muted p-5">
        {output ? (
          <div className="w-full space-y-3">
            <audio controls src={output.url} className="w-full" preload="metadata" />
            <p className="text-center text-xs text-muted-foreground">
              {output.filename} · {formatBytes(output.size)} · {formatAudioTime(output.duration)}
            </p>
            <p className="text-center text-xs text-subtle-foreground">
              Exported as 16-bit PCM WAV. Samples above 0 dBFS are clipped on export.
            </p>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            <Volume2 className="mx-auto mb-3 size-8 text-subtle-foreground" aria-hidden="true" />
            Load a file, set a gain, then boost it into a WAV here.
          </div>
        )}
      </div>
    </div>
  );
}
