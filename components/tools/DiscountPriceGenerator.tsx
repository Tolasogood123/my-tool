"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { ClipboardCopy, Download, RotateCcw, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import { downloadText } from "@/lib/utils/download";
import {
  applyDiscount,
  discountedItemsToCsv,
  formatMoney,
  parsePriceList,
  validateDiscount,
} from "@/lib/utils/discount-price";
import type { DiscountType, DiscountedItem } from "@/lib/utils/discount-price";

export function DiscountPriceGenerator() {
  const [rawList, setRawList] = useState("T-Shirt, 19.99\nHoodie, 49.00\nCap, 14.50");
  const [discountType, setDiscountType] = useState<DiscountType>("percent");
  const [discountValue, setDiscountValue] = useState("20");
  const [items, setItems] = useState<DiscountedItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generate = () => {
    setError(null);
    setItems(null);

    const value = Number(discountValue);
    const discountError = validateDiscount(discountType, value);
    if (discountError) {
      setError(discountError);
      return;
    }

    const { items: parsed, errors } = parsePriceList(rawList);
    if (errors.length > 0) {
      setError(errors.slice(0, 5).join(" "));
      return;
    }

    try {
      setItems(applyDiscount(parsed, discountType, value));
      toast({ title: `${parsed.length} prices updated`, variant: "success" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not apply the discount.");
    }
  };

  const csv = () =>
    items ? discountedItemsToCsv(items, discountType, Number(discountValue)) : "";

  const copyCsv = async () => {
    if (!items) return;
    try {
      await copyTextToClipboard(csv());
      toast({ title: "CSV copied", variant: "success" });
    } catch (cause) {
      toast({
        title: "Copy failed",
        description: cause instanceof Error ? cause.message : "Try again.",
        variant: "error",
      });
    }
  };

  const downloadCsv = () => {
    if (!items) return;
    downloadText(csv(), "toladev-discounted-price-list.csv", "text/csv;charset=utf-8");
    toast({ title: "CSV downloaded", variant: "success" });
  };

  const reset = () => {
    setRawList("");
    setDiscountType("percent");
    setDiscountValue("20");
    setItems(null);
    setError(null);
  };

  const totalSavings = items
    ? items.reduce((sum, item) => sum + item.discountAmount, 0)
    : 0;
  const totalSale = items ? items.reduce((sum, item) => sum + item.salePrice, 0) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field
          label="Product price list"
          htmlFor="dp-list"
          hint="One item per line as “Name, price”. Commas or tabs both work; currency symbols are optional."
        >
          <Textarea
            id="dp-list"
            rows={10}
            value={rawList}
            onChange={(event) => setRawList(event.target.value)}
            placeholder={"T-Shirt, 19.99\nHoodie, 49.00\nCap, 14.50"}
            spellCheck={false}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Discount type" htmlFor="dp-type">
            <Select
              id="dp-type"
              value={discountType}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                setDiscountType(event.target.value as DiscountType);
                setDiscountValue(event.target.value === "percent" ? "20" : "5");
                setItems(null);
              }}
            >
              <option value="percent">Percentage (%)</option>
              <option value="fixed">Fixed amount ($)</option>
            </Select>
          </Field>
          <Field
            label={discountType === "percent" ? "Discount (%)" : "Discount amount ($)"}
            htmlFor="dp-value"
          >
            <Input
              id="dp-value"
              type="number"
              min={0}
              max={discountType === "percent" ? 100 : undefined}
              step={discountType === "percent" ? 1 : 0.01}
              inputMode="decimal"
              value={discountValue}
              onChange={(event) => setDiscountValue(event.target.value)}
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={generate}>
            <Tag className="size-4" aria-hidden="true" />
            Apply discount
          </Button>
          <Button variant="outline" onClick={copyCsv} disabled={!items}>
            <ClipboardCopy className="size-4" aria-hidden="true" />
            Copy CSV
          </Button>
          <Button variant="outline" onClick={downloadCsv} disabled={!items}>
            <Download className="size-4" aria-hidden="true" />
            Download CSV
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? <ErrorState title="Check the price list" description={error} /> : null}
      </div>

      <div className="flex min-h-96 flex-col rounded-card border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-medium">Discounted prices</span>
          {items ? <span className="text-xs text-muted-foreground">{items.length} items</span> : null}
        </div>

        {items && items.length > 0 ? (
          <>
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {items.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 rounded-control border border-border bg-surface-muted px-4 py-3"
                >
                  <p className="min-w-0 break-words text-sm font-medium">{item.name}</p>
                  <p className="text-right text-sm font-semibold tabular-nums text-accent">
                    {formatMoney(item.salePrice)}
                  </p>
                  <p className="text-xs text-muted-foreground line-through">
                    {formatMoney(item.originalPrice)}
                  </p>
                  <p className="text-right text-xs text-muted-foreground">
                    −{formatMoney(item.discountAmount)}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-border p-4">
              <div>
                <p className="text-xs text-muted-foreground">Total savings</p>
                <p className="text-lg font-semibold tabular-nums">{formatMoney(totalSavings)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total sale value</p>
                <p className="text-lg font-semibold tabular-nums">{formatMoney(totalSale)}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Add product lines, choose a discount and click Apply discount to preview the new prices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
