"use client";

import { useState } from "react";
import { AlertTriangle, Copy, Download, KeyRound, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { decodeJwt, formatJwtReport } from "@/lib/utils/jwt";
import type { DecodedJwt } from "@/lib/utils/jwt";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import { downloadText } from "@/lib/utils/download";

export function JwtDecoder() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const decode = () => {
    setError(null);
    setDecoded(null);
    const output = decodeJwt(token);
    setError(output.error);
    setDecoded(output.decoded);
  };

  const reset = () => {
    setToken("");
    setDecoded(null);
    setError(null);
  };

  const report = decoded ? formatJwtReport(decoded) : "";

  const copy = async () => {
    try {
      await copyTextToClipboard(report);
      toast({ title: "Decoded token copied", variant: "success" });
    } catch (cause) {
      toast({
        title: "Could not copy",
        description: cause instanceof Error ? cause.message : "Select the text manually.",
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-card border border-warning/40 bg-warning-soft p-4">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold">Decode only — no signature verification</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            This tool shows what is inside a JWT. It does not check whether the
            signature is valid, so never trust the contents as proof of identity.
          </p>
        </div>
      </div>

      <Field label="JSON Web Token" htmlFor="jwt-input" hint="Paste a token in header.payload.signature form.">
        <Textarea
          id="jwt-input"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature"
          className="min-h-32 break-all font-mono text-xs leading-6"
        />
      </Field>

      <div className="flex flex-wrap gap-3">
        <Button onClick={decode}>
          <KeyRound className="size-4" aria-hidden="true" />
          Decode token
        </Button>
        <Button variant="outline" onClick={copy} disabled={!decoded}>
          <Copy className="size-4" aria-hidden="true" />
          Copy result
        </Button>
        <Button
          variant="outline"
          onClick={() => downloadText(report, "jwt-decoded.txt")}
          disabled={!decoded}
        >
          <Download className="size-4" aria-hidden="true" />
          Download
        </Button>
        <Button variant="ghost" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      {error ? <ErrorState title="Could not decode" description={error} /> : null}

      {decoded ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-card border border-border bg-surface p-5">
              <h2 className="text-sm font-semibold">Header</h2>
              <pre className="scrollbar-thin mt-3 overflow-auto font-mono text-xs leading-6 text-muted-foreground">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>
            {decoded.expired !== null ? (
              <p
                className={`rounded-control border p-4 text-sm font-semibold ${
                  decoded.expired
                    ? "border-danger/30 bg-danger-soft text-danger"
                    : "border-success/30 bg-success-soft text-success"
                }`}
              >
                {decoded.expired ? "The exp claim is in the past." : "The exp claim is in the future."}
              </p>
            ) : null}
          </div>
          <div className="rounded-card border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold">Payload</h2>
            <pre className="scrollbar-thin mt-3 max-h-80 overflow-auto font-mono text-xs leading-6 text-muted-foreground">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
            <div className="mt-4 space-y-1 border-t border-border pt-4 text-xs text-subtle-foreground">
              <p>Issued at: {decoded.issuedAt ?? "not present"}</p>
              <p>Expires at: {decoded.expiresAt ?? "not present"}</p>
              <p>Signature: {decoded.signatureLength} characters (not verified)</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
