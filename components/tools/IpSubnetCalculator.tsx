"use client";

import { useState } from "react";
import { Calculator, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  calculateSubnet,
  formatSubnetReport,
  SUBNET_EXAMPLES,
} from "@/lib/utils/ip-subnet";
import type { SubnetResult } from "@/lib/utils/ip-subnet";

export function IpSubnetCalculator() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    const outcome = calculateSubnet(value);
    setError(outcome.error);
    setResult(outcome.result);
  };

  const reset = () => {
    setValue("");
    setResult(null);
    setError(null);
  };

  const report = result ? formatSubnetReport(result) : "";

  const rows: Array<[string, string]> = result
    ? [
        ["CIDR input", result.input],
        ["IP address", result.address],
        ["Prefix length", `/${result.prefix}`],
        ["Subnet mask", result.subnetMask],
        ["Wildcard mask", result.wildcardMask],
        ["Mask (binary)", result.maskBinary],
        ["Network address", result.networkAddress],
        ["Broadcast address", result.broadcastAddress],
        ["First usable host", result.firstHost],
        ["Last usable host", result.lastHost],
        ["Total addresses", result.totalAddresses.toLocaleString("en-US")],
        ["Usable hosts", result.usableHosts.toLocaleString("en-US")],
        ["Address class", result.addressClass],
        ["Scope", result.isPrivate ? "Private / special-use" : "Public / global"],
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-border bg-surface-muted p-4 text-sm text-muted-foreground">
        IPv4 only. The maths runs entirely in your browser &mdash; the address you enter is
        never sent anywhere or stored.
      </div>

      <Field
        label="IPv4 address in CIDR notation"
        htmlFor="cidr-input"
        hint="Enter four octets and an optional prefix, e.g. 192.168.1.0/24. A missing prefix defaults to /32."
      >
        <Input
          id="cidr-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") calculate();
          }}
          placeholder="192.168.1.0/24"
          className="font-mono"
        />
      </Field>

      <div className="flex flex-wrap gap-2">
        {SUBNET_EXAMPLES.map((example) => (
          <Button
            key={example}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setValue(example);
              setResult(null);
              setError(null);
            }}
            className="font-mono"
          >
            {example}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={calculate}>
          <Calculator className="size-4" aria-hidden="true" />
          Calculate subnet
        </Button>
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      {error ? (
        <ErrorState title="Invalid CIDR address" description={error} icon={Search} />
      ) : null}

      {result ? (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map(([label, content]) => (
              <div
                key={label}
                className="min-w-0 rounded-control border border-border bg-surface p-4"
              >
                <p className="text-xs font-medium text-subtle-foreground">{label}</p>
                <p className="mt-1 break-all font-mono text-sm font-semibold">{content}</p>
              </div>
            ))}
          </div>
          <ToolOutput
            label="Subnet report"
            value={report}
            filename="subnet-report.txt"
            rows={14}
            onClear={() => setResult(null)}
          />
        </div>
      ) : null}
    </div>
  );
}
