"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  buildUtmUrl,
  EMPTY_UTM,
  parseUtmParams,
  validateUrl,
} from "@/lib/utils/utm-link";
import type { UtmParams } from "@/lib/utils/utm-link";

const QUICK_PRESETS: Array<{ label: string; source: string; medium: string }> = [
  { label: "Email newsletter", source: "newsletter", medium: "email" },
  { label: "Instagram bio", source: "instagram", medium: "organic-social" },
  { label: "Google Ads", source: "google", medium: "cpc" },
  { label: "Partner blog", source: "partner-blog", medium: "referral" },
];

const FIELDS: Array<{
  key: keyof UtmParams;
  label: string;
  id: string;
  placeholder: string;
  hint: string;
}> = [
  {
    key: "source",
    label: "Campaign source (utm_source)",
    id: "utm-source",
    placeholder: "newsletter",
    hint: "Who sent the visit, such as google or instagram.",
  },
  {
    key: "medium",
    label: "Campaign medium (utm_medium)",
    id: "utm-medium",
    placeholder: "email",
    hint: "The channel, such as email, cpc, or organic-social.",
  },
  {
    key: "campaign",
    label: "Campaign name (utm_campaign)",
    id: "utm-campaign",
    placeholder: "spring-launch-2026",
    hint: "The specific promotion or campaign.",
  },
  {
    key: "term",
    label: "Search term (utm_term)",
    id: "utm-term",
    placeholder: "running shoes",
    hint: "Optional paid-search keyword.",
  },
  {
    key: "content",
    label: "Content variant (utm_content)",
    id: "utm-content",
    placeholder: "blue-button",
    hint: "Optional label to compare ad or link variants.",
  },
];

export function UtmLinkBuilder() {
  const [baseUrl, setBaseUrl] = useState("");
  const [params, setParams] = useState<UtmParams>({ ...EMPTY_UTM });
  const { toast } = useToast();

  const result = useMemo(() => buildUtmUrl(baseUrl, params), [baseUrl, params]);
  const showError = baseUrl.trim().length > 0 && result.error !== null;

  const update = (key: keyof UtmParams, value: string) =>
    setParams((current) => ({ ...current, [key]: value }));

  const applyPreset = (source: string, medium: string) =>
    setParams((current) => ({ ...current, source, medium }));

  const importParams = () => {
    const parsed = parseUtmParams(baseUrl);
    if (!parsed.source && !parsed.medium && !parsed.campaign && !parsed.term && !parsed.content) {
      toast({
        title: "No UTM parameters found",
        description: "That URL does not contain utm_ values to import.",
        variant: "info",
      });
      return;
    }
    setParams(parsed);
    toast({ title: "UTM values imported", variant: "success" });
  };

  const reset = () => {
    setBaseUrl("");
    setParams({ ...EMPTY_UTM });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Field
          label="Destination URL"
          htmlFor="utm-base-url"
          hint="A full http or https URL. Existing query parameters are preserved."
          required
        >
          <Input
            id="utm-base-url"
            type="url"
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value)}
            placeholder="https://example.com/spring-launch"
            aria-invalid={showError}
          />
        </Field>

        <div className="flex flex-wrap gap-2">
          {QUICK_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(preset.source, preset.medium)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <Field
              key={field.key}
              label={field.label}
              htmlFor={field.id}
              hint={field.hint}
            >
              <Input
                id={field.id}
                value={params[field.key]}
                onChange={(event) => update(field.key, event.target.value)}
                placeholder={field.placeholder}
              />
            </Field>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={importParams} disabled={!!validateUrl(baseUrl)}>
            <Sparkles className="size-4" aria-hidden="true" />
            Import UTMs from URL
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {showError ? (
          <ErrorState title="Check the destination URL" description={result.error ?? ""} />
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-card border border-border bg-surface p-4">
          <h3 className="text-sm font-semibold">Parameters applied</h3>
          <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {FIELDS.map((field) => (
              <div key={field.key} className="min-w-0 rounded-control bg-surface-muted px-3 py-2">
                <dt className="text-xs text-subtle-foreground">utm_{field.key}</dt>
                <dd className="break-all font-medium">
                  {params[field.key].trim() || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ToolOutput
          label="Tracked link"
          value={result.url}
          filename="tracked-link.txt"
          mimeType="text/plain;charset=utf-8"
          rows={6}
          placeholder="Enter a URL and UTM values to build a tracked link."
        />
        <p className="text-xs text-subtle-foreground">
          Parameters are encoded with the browser&apos;s URL and URLSearchParams APIs, so spaces,
          ampersands, and non-ASCII characters are handled for you.
        </p>
      </div>
    </div>
  );
}
