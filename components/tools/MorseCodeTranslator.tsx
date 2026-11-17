"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Binary, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  morseToText,
  morseToTimeline,
  textToMorse,
} from "@/lib/utils/morse-code";

type Direction = "encode" | "decode";

export function MorseCodeTranslator() {
  const [direction, setDirection] = useState<Direction>("encode");
  const [input, setInput] = useState("");
  const [dotMs, setDotMs] = useState(90);
  const [playing, setPlaying] = useState(false);

  const audioRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<OscillatorNode[]>([]);

  const encodeResult = useMemo(() => textToMorse(input), [input]);
  const decodeResult = useMemo(() => morseToText(input), [input]);

  const output = direction === "encode" ? encodeResult.morse : decodeResult.text;
  const warnings = direction === "encode" ? encodeResult.unsupported : decodeResult.unknown;
  const morseToPlay = direction === "encode" ? encodeResult.morse : input;

  const stop = () => {
    for (const node of nodesRef.current) {
      try {
        node.stop();
      } catch {
        // Already stopped.
      }
    }
    nodesRef.current = [];
    if (audioRef.current) {
      void audioRef.current.close();
      audioRef.current = null;
    }
    setPlaying(false);
  };

  useEffect(() => {
    return () => {
      for (const node of nodesRef.current) {
        try {
          node.stop();
        } catch {
          // Already stopped.
        }
      }
      if (audioRef.current) void audioRef.current.close();
    };
  }, []);

  const play = () => {
    stop();
    const timeline = morseToTimeline(morseToPlay, dotMs);
    if (timeline.length === 0) return;

    const AudioContextCtor: typeof AudioContext =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;

    try {
      const context = new AudioContextCtor();
      audioRef.current = context;
      const gain = context.createGain();
      gain.gain.value = 0.15;
      gain.connect(context.destination);

      let cursor = context.currentTime + 0.05;
      for (const event of timeline) {
        if (event.type === "tone") {
          const oscillator = context.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.value = 600;
          oscillator.connect(gain);
          oscillator.start(cursor);
          oscillator.stop(cursor + event.durationMs / 1000);
          nodesRef.current.push(oscillator);
        }
        cursor += event.durationMs / 1000;
      }
      setPlaying(true);
    } catch {
      stop();
    }
  };

  const reset = () => {
    stop();
    setInput("");
  };

  const changeDirection = (next: Direction) => {
    stop();
    setDirection(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Translation direction">
        <Button
          variant={direction === "encode" ? "primary" : "outline"}
          onClick={() => changeDirection("encode")}
        >
          Text → Morse
        </Button>
        <Button
          variant={direction === "decode" ? "primary" : "outline"}
          onClick={() => changeDirection("decode")}
        >
          Morse → Text
        </Button>
      </div>

      <Field
        label={direction === "encode" ? "Plain text" : "Morse code"}
        htmlFor="morse-input"
        hint={
          direction === "encode"
            ? "Letters, digits and common punctuation are encoded. Use spaces between words."
            : "Use spaces between letters and “/” between words, e.g. .... .. / .-- --- .-. .-.. -.."
        }
      >
        <Textarea
          id="morse-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={
            direction === "encode" ? "SOS" : "... --- ..."
          }
          className="min-h-32 text-sm leading-7"
        />
      </Field>

      <div className="flex flex-wrap gap-3">
        <Button variant="ghost" onClick={reset} disabled={!input}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      {warnings.length > 0 ? (
        <div
          role="status"
          className="flex flex-wrap items-start gap-2 rounded-control border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-muted-foreground"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" />
          <span>
            {direction === "encode"
              ? "Characters with no Morse equivalent were skipped: "
              : "Unrecognized Morse groups were shown as □: "}
            <span className="font-mono font-semibold text-foreground">
              {warnings.join(" ")}
            </span>
          </span>
        </div>
      ) : null}

      <ToolOutput
        label={direction === "encode" ? "Morse code" : "Decoded text"}
        value={output}
        filename={direction === "encode" ? "morse-code.txt" : "decoded-text.txt"}
        rows={5}
      />

      <div className="space-y-3 rounded-card border border-border bg-surface-muted p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Binary className="size-4" aria-hidden="true" />
          Audio playback
        </div>
        <Field
          label={`Dot length: ${dotMs} ms`}
          htmlFor="morse-speed"
          hint="Standard timing uses a dot as one unit, a dash as three, and a word gap as seven."
        >
          <input
            id="morse-speed"
            type="range"
            min={40}
            max={200}
            step={10}
            value={dotMs}
            onChange={(event) => setDotMs(Number(event.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </Field>
        <div className="flex flex-wrap gap-3">
          <Button onClick={play} disabled={!morseToPlay.trim()}>
            <Play className="size-4" aria-hidden="true" />
            Play
          </Button>
          <Button variant="outline" onClick={stop} disabled={!playing}>
            <Pause className="size-4" aria-hidden="true" />
            Stop
          </Button>
        </div>
        <p className="text-xs text-subtle-foreground">
          Playback uses your browser&apos;s Web Audio API and makes sound only after you press Play.
        </p>
      </div>
    </div>
  );
}
