"use client";

import { useEffect, useRef, useState } from "react";
import { Coffee, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import {
  DEFAULT_DURATIONS,
  formatClock,
  nextMode,
  progressPercent,
} from "@/lib/utils/pomodoro";
import type { PomodoroMode } from "@/lib/utils/pomodoro";

const MODES: { id: PomodoroMode; label: string }[] = [
  { id: "focus", label: "Focus" },
  { id: "short", label: "Short break" },
  { id: "long", label: "Long break" },
];

export function PomodoroTimer() {
  const [mode, setMode] = useState<PomodoroMode>("focus");
  const [durations, setDurations] = useState(DEFAULT_DURATIONS);
  const [remaining, setRemaining] = useState(DEFAULT_DURATIONS.focus * 60);
  const [running, setRunning] = useState(false);
  const [completedFocus, setCompletedFocus] = useState(0);
  const [message, setMessage] = useState("");

  const endAtRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);
  const modeRef = useRef(mode);
  const durationsRef = useRef(durations);
  const completedRef = useRef(completedFocus);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    durationsRef.current = durations;
  }, [durations]);
  useEffect(() => {
    completedRef.current = completedFocus;
  }, [completedFocus]);

  useEffect(() => {
    if (!running) return;

    const interval = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setRemaining(left);

      if (left > 0) return;

      window.clearInterval(interval);
      setRunning(false);

      // A short confirmation tone; the AudioContext is created on Start (a user gesture).
      try {
        const context = audioRef.current;
        if (context) {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.frequency.value = 880;
          gain.gain.value = 0.08;
          oscillator.start();
          oscillator.stop(context.currentTime + 0.2);
        }
      } catch {
        // Audio is optional; the timer still completes silently.
      }

      const current = modeRef.current;
      const nextCount = current === "focus" ? completedRef.current + 1 : completedRef.current;
      if (current === "focus") setCompletedFocus(nextCount);
      const next = nextMode(current, nextCount);
      setMode(next);
      setRemaining(durationsRef.current[next] * 60);
      setMessage(
        current === "focus"
          ? `Focus session complete. Time for a ${next === "long" ? "long" : "short"} break.`
          : "Break over. Ready for the next focus session?",
      );
    }, 250);

    return () => window.clearInterval(interval);
  }, [running]);

  const start = () => {
    if (remaining <= 0) return;
    try {
      if (!audioRef.current) {
        audioRef.current = new AudioContext();
      }
      void audioRef.current.resume();
    } catch {
      // Ignore browsers that block audio.
    }
    setMessage("");
    endAtRef.current = Date.now() + remaining * 1000;
    setRunning(true);
  };

  const pause = () => {
    setRemaining(Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000)));
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setRemaining(durations[mode] * 60);
    setMessage("");
  };

  const selectMode = (next: PomodoroMode) => {
    setRunning(false);
    setMode(next);
    setRemaining(durations[next] * 60);
    setMessage("");
  };

  const changeDuration = (next: PomodoroMode, value: string) => {
    const minutes = Math.min(120, Math.max(1, Number(value) || 1));
    const updated = { ...durations, [next]: minutes };
    setDurations(updated);
    durationsRef.current = updated;
    if (next === mode && !running) setRemaining(minutes * 60);
  };

  const percent = progressPercent(remaining, durations[mode]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="space-y-5">
        <div role="tablist" aria-label="Timer mode" className="flex flex-wrap gap-2">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={mode === item.id}
              onClick={() => selectMode(item.id)}
              className={`rounded-pill px-4 py-2 text-sm font-semibold transition-colors ${
                mode === item.id
                  ? "btn-primary"
                  : "border border-border bg-surface text-muted-foreground hover:bg-surface-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="rounded-card border border-border bg-surface p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">
            {MODES.find((item) => item.id === mode)?.label}
          </p>
          <p
            role="timer"
            aria-live="off"
            className="mt-4 font-mono text-6xl font-semibold tabular-nums tracking-tight text-accent sm:text-7xl"
          >
            {formatClock(remaining)}
          </p>
          <div
            className="mt-6 h-2 overflow-hidden rounded-full bg-surface-muted"
            role="progressbar"
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Session progress"
          >
            <div className="h-full rounded-full bg-linear-to-r from-accent to-accent-2 transition-[width] duration-300" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={running ? pause : start} disabled={!running && remaining <= 0}>
            {running ? (
              <Pause className="size-4" aria-hidden="true" />
            ) : (
              <Play className="size-4" aria-hidden="true" />
            )}
            {running ? "Pause" : "Start"}
          </Button>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {message ? (
          <p role="status" className="rounded-control border border-accent/30 bg-accent-soft p-4 text-sm text-accent-soft-foreground">
            {message}
          </p>
        ) : null}
      </div>

      <div className="space-y-5">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <Timer className="size-4 text-accent" aria-hidden="true" />
          Session settings
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {MODES.map((item) => (
            <Field key={item.id} label={`${item.label} (min)`} htmlFor={`pomodoro-${item.id}`}>
              <Input
                id={`pomodoro-${item.id}`}
                type="number"
                min={1}
                max={120}
                value={durations[item.id]}
                onChange={(event) => changeDuration(item.id, event.target.value)}
                disabled={running && item.id === mode}
              />
            </Field>
          ))}
        </div>
        <div className="rounded-card border border-border bg-surface-muted p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Coffee className="size-4 text-accent" aria-hidden="true" />
            {completedFocus} focus {completedFocus === 1 ? "session" : "sessions"} completed
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            A long break follows every fourth focus session. The timer runs in this tab, so keep the page open. No account, no sync, no data sent anywhere.
          </p>
        </div>
      </div>
    </div>
  );
}
