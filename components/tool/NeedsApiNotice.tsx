import { Radio } from "lucide-react";

interface NeedsApiNoticeProps {
  /** Which external service or credential the tool requires. */
  service: string;
  /** Short explanation of what happens when it is configured. */
  children?: React.ReactNode;
}

export function NeedsApiNotice({ service, children }: NeedsApiNoticeProps) {
  return (
    <div
      role="status"
      className="rounded-card border border-warning/40 bg-warning-soft p-5"
    >
      <div className="flex items-start gap-3">
        <Radio className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
        <div>
          <h2 className="text-sm font-semibold text-warning">
            Not working yet — needs an external API
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-foreground">
            This tool requires <strong>{service}</strong>. No key is configured on
            this deployment, so it cannot produce results. The form is shown only
            to explain how the finished tool will work — nothing is generated here.
          </p>
          {children ? (
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {children}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
