"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { filterNetworkPorts, formatNetworkPorts } from "@/lib/utils/network-port";
import type { PortProtocolFilter } from "@/lib/utils/network-port";

const PROTOCOLS: Array<{ value: PortProtocolFilter; label: string }> = [
  { value: "all", label: "All protocols" },
  { value: "TCP", label: "TCP (incl. TCP/UDP)" },
  { value: "UDP", label: "UDP (incl. TCP/UDP)" },
  { value: "TCP/UDP", label: "Both TCP & UDP" },
];

export function NetworkPortReference() {
  const [query, setQuery] = useState("");
  const [protocol, setProtocol] = useState<PortProtocolFilter>("all");

  const results = useMemo(() => filterNetworkPorts(query, protocol), [query, protocol]);
  const report = formatNetworkPorts(results);

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-border bg-surface-muted p-4 text-sm text-muted-foreground">
        Port numbers are conventions, not guarantees: any service can be configured to
        listen elsewhere. This list is a quick reference, not a scan of your machine.
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <Field
          label="Search ports"
          htmlFor="port-search"
          hint="Search by port number, service name or description."
        >
          <Input
            id="port-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. 443, SSH, database"
          />
        </Field>
        <Field label="Transport protocol" htmlFor="port-protocol">
          <Select
            id="port-protocol"
            value={protocol}
            onChange={(event) => setProtocol(event.target.value as PortProtocolFilter)}
          >
            {PROTOCOLS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing <span className="font-semibold text-foreground">{results.length}</span>{" "}
        {results.length === 1 ? "entry" : "entries"}.
      </p>

      {results.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-8 text-center">
          <Search className="mx-auto size-6 text-subtle-foreground" aria-hidden="true" />
          <p className="mt-3 text-sm text-muted-foreground">
            No ports match that search. Try a number or a service name.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {results.map((item) => (
            <li
              key={`${item.port}-${item.protocol}`}
              className="flex flex-col gap-2 rounded-control border border-border bg-surface p-4 sm:flex-row sm:items-start sm:gap-4"
            >
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-pill bg-accent-soft px-2.5 py-1 font-mono text-xs font-bold text-accent-soft-foreground">
                  {item.port}
                </span>
                <span className="inline-flex items-center rounded-pill bg-surface-muted px-2 py-1 font-mono text-[11px] font-semibold text-muted-foreground">
                  {item.protocol}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold">{item.service}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ToolOutput
        label="Visible ports"
        value={report}
        filename="network-ports.txt"
        rows={12}
      />
    </div>
  );
}
