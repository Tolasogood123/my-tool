"use client";

import { useEffect, useState } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  BROWSER_FACT_LABELS,
  collectBrowserFacts,
  formatBrowserFacts,
} from "@/lib/utils/browser-information";
import type { BrowserFacts } from "@/lib/utils/browser-information";

export function BrowserInformation() {
  const [facts, setFacts] = useState<BrowserFacts | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    queueMicrotask(() => setFacts(collectBrowserFacts()));
  }, []);

  const refresh = () => {
    setFacts(collectBrowserFacts());
    toast({ title: "Browser facts refreshed", variant: "success" });
  };

  const report = facts ? formatBrowserFacts(facts) : "";

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-card border border-success/30 bg-success-soft p-4">
        <ShieldCheck
          className="mt-0.5 size-5 shrink-0 text-success"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold">Read locally &mdash; nothing is sent anywhere</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Every value below is read directly from your own browser by this page. There
            is no network request, no analytics and no storage: the data never leaves your
            device. Some values (platform, screen size, user-agent) can be reported
            approximately or changed by the browser, so treat them as informational.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={refresh}>
          <RefreshCw className="size-4" aria-hidden="true" />
          Refresh values
        </Button>
      </div>

      {facts ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {BROWSER_FACT_LABELS.map(({ key, label }) => (
            <div
              key={key}
              className="min-w-0 rounded-control border border-border bg-surface p-4"
            >
              <p className="text-xs font-medium text-subtle-foreground">{label}</p>
              <p className="mt-1 break-all text-sm font-semibold">{facts[key]}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-card border border-dashed border-border bg-surface p-6 text-center text-sm text-muted-foreground">
          Reading the values your browser exposes&hellip;
        </p>
      )}

      <ToolOutput
        label="Browser information report"
        value={report}
        filename="browser-information.txt"
        rows={16}
      />
    </div>
  );
}
