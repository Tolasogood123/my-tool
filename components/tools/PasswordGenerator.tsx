"use client";

import { useState } from "react";
import { KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ToolOutput } from "@/components/tools/ToolOutput";

const SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
} as const;

type SetName = keyof typeof SETS;

const SIMILAR = new Set(["O", "0", "l", "1", "I", "|"]);

/** Uniform random integer in [0, max) using rejection sampling. */
function secureRandomInt(max: number): number {
  if (max <= 0 || max > 256) throw new Error("Invalid random range.");
  const limit = 256 - (256 % max);
  const buffer = new Uint8Array(1);
  let value = 256;
  while (value >= limit) {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  }
  return value % max;
}

function pick(pool: string): string {
  return pool[secureRandomInt(pool.length)];
}

export function PasswordGenerator() {
  const [length, setLength] = useState("20");
  const [enabled, setEnabled] = useState<Record<SetName, boolean>>({
    lowercase: true,
    uppercase: true,
    digits: true,
    symbols: true,
  });
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const activeSets = (Object.keys(SETS) as SetName[]).filter((name) => enabled[name]);

  const generate = () => {
    setError(null);
    const size = Number(length);

    if (!Number.isInteger(size) || size < 8 || size > 64) {
      setError("Choose a length between 8 and 64 characters.");
      return;
    }
    if (activeSets.length === 0) {
      setError("Select at least one character set.");
      return;
    }

    try {
      let pool = activeSets.map((name) => SETS[name]).join("");
      if (excludeSimilar) {
        pool = [...pool].filter((character) => !SIMILAR.has(character)).join("");
      }
      if (!pool) {
        setError("Excluding similar characters removed every option. Enable another set.");
        return;
      }

      const characters: string[] = activeSets.map((name) => {
        const set = excludeSimilar
          ? [...SETS[name]].filter((character) => !SIMILAR.has(character)).join("")
          : SETS[name];
        const safePool = set || pool;
        return pick(safePool);
      });

      while (characters.length < size) {
        characters.push(pick(pool));
      }

      // Fisher-Yates shuffle with uniform randomness.
      for (let i = characters.length - 1; i > 0; i -= 1) {
        const j = secureRandomInt(i + 1);
        [characters[i], characters[j]] = [characters[j], characters[i]];
      }

      setPassword(characters.join(""));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Your browser does not provide secure randomness (crypto.getRandomValues).",
      );
    }
  };

  const entropy = password
    ? activeSets
        .map((name) => SETS[name])
        .join("").length * Number(length || 0) * 0.30103
    : 0;
  const strength = entropy >= 100 ? "Very strong" : entropy >= 65 ? "Strong" : entropy >= 45 ? "Fair" : "Weak";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Length" htmlFor="password-length" hint="Between 8 and 64 characters.">
          <Input
            id="password-length"
            type="number"
            min={8}
            max={64}
            value={length}
            onChange={(event) => setLength(event.target.value)}
          />
        </Field>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Character sets</legend>
          {(Object.keys(SETS) as SetName[]).map((name) => (
            <label key={name} className="flex items-center gap-2.5 text-sm capitalize">
              <input
                type="checkbox"
                checked={enabled[name]}
                onChange={(event) =>
                  setEnabled((current) => ({ ...current, [name]: event.target.checked }))
                }
                className="size-4 rounded-control border-border accent-[var(--accent)]"
              />
              {name === "digits" ? "Numbers" : name}
            </label>
          ))}
          <label className="flex items-center gap-2.5 pt-1 text-sm">
            <input
              type="checkbox"
              checked={excludeSimilar}
              onChange={(event) => setExcludeSimilar(event.target.checked)}
              className="size-4 rounded-control border-border accent-[var(--accent)]"
            />
            Exclude similar characters (O, 0, l, 1, I)
          </label>
        </fieldset>

        <div className="flex flex-wrap gap-3">
          <Button onClick={generate}>
            <KeyRound className="size-4" aria-hidden="true" />
            Generate
          </Button>
          {password ? (
            <Button variant="outline" onClick={generate}>
              <RefreshCw className="size-4" aria-hidden="true" />
              Regenerate
            </Button>
          ) : null}
        </div>

        {error ? (
          <p role="alert" className="rounded-card border border-danger/30 bg-danger-soft p-4 text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-card border border-border bg-surface-muted p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-subtle-foreground">
            Generated password
          </p>
          <p className="mt-4 break-all font-mono text-2xl font-semibold text-accent">
            {password || "—"}
          </p>
          {password ? (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-pill border border-success/30 bg-success-soft px-3 py-1 text-xs font-semibold text-success">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              {strength} · ~{Math.round(entropy)} bits of entropy
            </p>
          ) : (
            <p className="mt-4 text-xs text-muted-foreground">
              Uses crypto.getRandomValues — never Math.random.
            </p>
          )}
        </div>
        <ToolOutput
          label="Password value"
          value={password}
          filename="password.txt"
          rows={2}
          onClear={() => setPassword("")}
        />
      </div>
    </div>
  );
}
