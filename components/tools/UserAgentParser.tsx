"use client";

import { useState } from "react";
import { AlertTriangle, Fingerprint, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { formatUserAgentReport, parseUserAgent } from "@/lib/utils/user-agent";
import type { UserAgentInfo } from "@/lib/utils/user-agent";

export function UserAgentParser() {
  const [value, setValue] = useState("");
  const [info, setInfo] = useState<UserAgentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parse = () => {
    const output = parseUserAgent(value);
    if (!output.raw) {
      setError("Paste a user-agent string first, or use the button to load your own.");
      setInfo(null);
      return;
    }
    setError(null);
    setInfo(output);
  };

  const useCurrent = () => {
    const current = typeof navigator !== "undefined" ? navigator.userAgent : "";
    setValue(current);
    setError(null);
    setInfo(null);
  };

  const reset = () => {
    setValue("");
    setInfo(null);
    setError(null);
  };

  const report = info ? formatUserAgentReport(info) : "";

  const rows: Array<[string, string]> = info
    ? [
        ["Browser", info.browser],
        ["Rendering engine", info.engine],
        ["Operating system", info.os],
        ["Device type", info.device],
        ["Mobile signature", info.isMobile ? "Yes" : "No"],
        ["Automated client", info.isBot ? "Likely bot / crawler" : "No signature detected"],
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-card border border-warning/40 bg-warning-soft p-4">
        <AlertTriangle
          className="mt-0.5 size-5 shrink-0 text-warning"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold">User-agent strings can be spoofed</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            A user-agent is just text supplied by the client. Any browser, extension or
            script can change it, so treat the results below as a hint, never as proof of
            identity, operating system or device. Parsing happens locally in your browser.
          </p>
        </div>
      </div>

      <Field
        label="User-agent string"
        htmlFor="ua-input"
        hint="Paste a full UA string, or load the one your current browser sends."
      >
        <Textarea
          id="ua-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ..."
          className="min-h-28 break-all font-mono text-xs leading-6"
        />
      </Field>

      <div className="flex flex-wrap gap-3">
        <Button onClick={parse}>
          <Fingerprint className="size-4" aria-hidden="true" />
          Parse user-agent
        </Button>
        <Button variant="outline" onClick={useCurrent}>
          Use my browser&apos;s UA
        </Button>
        <Button variant="ghost" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      {error ? (
        <ErrorState title="Nothing to parse" description={error} icon={Fingerprint} />
      ) : null}

      {info ? (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {rows.map(([label, content]) => (
              <div
                key={label}
                className="min-w-0 rounded-control border border-border bg-surface p-4"
              >
                <p className="text-xs font-medium text-subtle-foreground">{label}</p>
                <p className="mt-1 break-words text-sm font-semibold">{content}</p>
              </div>
            ))}
          </div>
          <ToolOutput
            label="Parsed user-agent report"
            value={report}
            filename="user-agent-report.txt"
            rows={12}
            onClear={() => setInfo(null)}
          />
        </div>
      ) : null}
    </div>
  );
}
