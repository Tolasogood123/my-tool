"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { ClipboardCopy, Download, FileText, RotateCcw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import { downloadText } from "@/lib/utils/download";
import {
  generateReturnPolicy,
  NOT_LEGAL_ADVICE_NOTICE,
  validateReturnPolicyConfig,
} from "@/lib/utils/return-policy";
import type {
  RefundMethod,
  ReturnPolicyConfig,
  ReturnShippingPayer,
} from "@/lib/utils/return-policy";

const EMPTY_FORM = {
  storeName: "",
  returnWindowDays: "30",
  shippingPayer: "store" as ReturnShippingPayer,
  refundMethod: "original-payment" as RefundMethod,
  restockingFeePercent: "0",
  contactEmail: "",
  effectiveDate: "",
  conditions: "Items are unused and in their original packaging.\nProof of purchase is included.",
  extraNotes: "",
};

export function ReturnPolicyGenerator() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [policy, setPolicy] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const set = (key: keyof typeof EMPTY_FORM) => (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const generate = () => {
    setError(null);
    const config: ReturnPolicyConfig = {
      storeName: form.storeName,
      returnWindowDays: Number(form.returnWindowDays),
      shippingPayer: form.shippingPayer,
      refundMethod: form.refundMethod,
      restockingFeePercent: Number(form.restockingFeePercent),
      contactEmail: form.contactEmail,
      effectiveDate: form.effectiveDate,
      conditions: form.conditions.split("\n").map((line) => line.trim()).filter(Boolean),
      extraNotes: form.extraNotes,
    };
    const validationError = validateReturnPolicyConfig(config);
    if (validationError) {
      setError(validationError);
      setPolicy("");
      return;
    }
    try {
      setPolicy(generateReturnPolicy(config));
      toast({ title: "Policy generated", variant: "success" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not generate the policy.");
    }
  };

  const copy = async () => {
    if (!policy) return;
    try {
      await copyTextToClipboard(policy);
      toast({ title: "Policy copied", variant: "success" });
    } catch (cause) {
      toast({
        title: "Copy failed",
        description: cause instanceof Error ? cause.message : "Try again.",
        variant: "error",
      });
    }
  };

  const download = () => {
    if (!policy) return;
    const safeName = form.storeName.trim().replace(/[^a-zA-Z0-9-_]+/g, "-").toLowerCase() || "store";
    downloadText(policy, `${safeName}-return-policy.md`, "text/markdown;charset=utf-8");
    toast({ title: "Policy downloaded", variant: "success" });
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setPolicy("");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="rounded-card border border-warning/30 bg-surface p-4">
          <p className="flex items-start gap-2 text-sm font-medium text-warning">
            <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Not legal advice
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{NOT_LEGAL_ADVICE_NOTICE}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Store name" htmlFor="rp-store" required>
            <Input id="rp-store" value={form.storeName} onChange={set("storeName")} placeholder="Northstar Goods" />
          </Field>
          <Field label="Return window (days)" htmlFor="rp-window">
            <Input id="rp-window" type="number" min={1} step={1} inputMode="numeric" value={form.returnWindowDays} onChange={set("returnWindowDays")} />
          </Field>
          <Field label="Return shipping" htmlFor="rp-shipping">
            <Select id="rp-shipping" value={form.shippingPayer} onChange={set("shippingPayer")}>
              <option value="store">Store pays</option>
              <option value="customer">Customer pays</option>
            </Select>
          </Field>
          <Field label="Refund method" htmlFor="rp-refund">
            <Select id="rp-refund" value={form.refundMethod} onChange={set("refundMethod")}>
              <option value="original-payment">Original payment method</option>
              <option value="store-credit">Store credit</option>
              <option value="exchange">Exchange only</option>
            </Select>
          </Field>
          <Field label="Restocking fee (%)" htmlFor="rp-fee">
            <Input id="rp-fee" type="number" min={0} max={100} step={0.5} inputMode="decimal" value={form.restockingFeePercent} onChange={set("restockingFeePercent")} />
          </Field>
          <Field label="Contact email" htmlFor="rp-email" required>
            <Input id="rp-email" type="email" value={form.contactEmail} onChange={set("contactEmail")} placeholder="returns@example.com" />
          </Field>
        </div>

        <Field label="Effective date" htmlFor="rp-date">
          <Input id="rp-date" type="date" value={form.effectiveDate} onChange={set("effectiveDate")} />
        </Field>

        <Field label="Return conditions" htmlFor="rp-conditions" hint="One condition per line.">
          <Textarea id="rp-conditions" rows={4} value={form.conditions} onChange={set("conditions")} />
        </Field>

        <Field label="Additional notes (optional)" htmlFor="rp-notes">
          <Textarea id="rp-notes" rows={3} value={form.extraNotes} onChange={set("extraNotes")} placeholder="Seasonal items, final-sale exclusions, etc." />
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button onClick={generate}>
            <FileText className="size-4" aria-hidden="true" />
            Generate policy
          </Button>
          <Button variant="outline" onClick={copy} disabled={!policy}>
            <ClipboardCopy className="size-4" aria-hidden="true" />
            Copy
          </Button>
          <Button variant="outline" onClick={download} disabled={!policy}>
            <Download className="size-4" aria-hidden="true" />
            Download .md
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check the policy details" description={error} /> : null}
      </div>

      <div className="flex min-h-96 flex-col rounded-card border border-border bg-surface">
        <div className="border-b border-border px-4 py-3 text-sm font-medium">Policy preview</div>
        {policy ? (
          <pre className="flex-1 whitespace-pre-wrap break-words p-4 text-xs leading-6 text-foreground">
            {policy}
          </pre>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Fill in your store details and click Generate policy to preview it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
