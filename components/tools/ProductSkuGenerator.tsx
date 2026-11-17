"use client";

import { useState } from "react";
import { Download, Hash, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { useToast } from "@/components/ui/Toast";
import { downloadText } from "@/lib/utils/download";
import {
  generateSkus,
  skusToCsv,
  type SkuOptions,
} from "@/lib/utils/product-sku";

export function ProductSkuGenerator() {
  const [prefix, setPrefix] = useState("");
  const [category, setCategory] = useState("");
  const [separator, setSeparator] = useState("-");
  const [start, setStart] = useState("1");
  const [quantity, setQuantity] = useState("10");
  const [padding, setPadding] = useState("4");
  const [suffix, setSuffix] = useState("");
  const [skus, setSkus] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generate = () => {
    const options: SkuOptions = {
      prefix,
      category,
      separator,
      start: Number(start),
      quantity: Number(quantity),
      padding: Number(padding),
      suffix,
    };
    const output = generateSkus(options);
    setSkus(output.skus);
    setError(output.error);
    if (!output.error) {
      toast({
        title: "SKUs generated",
        description: `${output.skus.length} unique codes ready.`,
        variant: "success",
      });
    }
  };

  const downloadCsv = () => {
    if (skus.length === 0) return;
    downloadText(skusToCsv(skus), "product-skus.csv", "text/csv;charset=utf-8");
    toast({ title: "Download started", description: "product-skus.csv", variant: "success" });
  };

  const reset = () => {
    setPrefix("");
    setCategory("");
    setSeparator("-");
    setStart("1");
    setQuantity("10");
    setPadding("4");
    setSuffix("");
    setSkus([]);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Prefix"
            htmlFor="sku-prefix"
            hint="e.g. brand initials like ACME."
          >
            <Input
              id="sku-prefix"
              value={prefix}
              onChange={(event) => setPrefix(event.target.value)}
              placeholder="ACME"
            />
          </Field>
          <Field
            label="Category code"
            htmlFor="sku-category"
            hint="e.g. TSHIRT or MUG."
          >
            <Input
              id="sku-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="TSHIRT"
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Separator" htmlFor="sku-separator">
            <Input
              id="sku-separator"
              value={separator}
              onChange={(event) => setSeparator(event.target.value)}
              placeholder="-"
              maxLength={3}
            />
          </Field>
          <Field label="Suffix (optional)" htmlFor="sku-suffix">
            <Input
              id="sku-suffix"
              value={suffix}
              onChange={(event) => setSuffix(event.target.value)}
              placeholder="2026"
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Start number" htmlFor="sku-start">
            <Input
              id="sku-start"
              type="number"
              min={0}
              step={1}
              value={start}
              onChange={(event) => setStart(event.target.value)}
              placeholder="1"
            />
          </Field>
          <Field label="Quantity (1-100)" htmlFor="sku-quantity">
            <Input
              id="sku-quantity"
              type="number"
              min={1}
              max={100}
              step={1}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="10"
            />
          </Field>
          <Field label="Number padding" htmlFor="sku-padding">
            <Input
              id="sku-padding"
              type="number"
              min={1}
              max={10}
              step={1}
              value={padding}
              onChange={(event) => setPadding(event.target.value)}
              placeholder="4"
            />
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={generate}>
            <Hash className="size-4" aria-hidden="true" />
            Generate SKUs
          </Button>
          <Button
            variant="outline"
            onClick={downloadCsv}
            disabled={skus.length === 0}
          >
            <Download className="size-4" aria-hidden="true" />
            Download CSV
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
        {error ? (
          <ErrorState title="Could not generate SKUs" description={error} />
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-card border border-accent/30 bg-accent-soft p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft-foreground">
            Unique codes generated
          </p>
          <p className="mt-3 text-4xl font-semibold tabular-nums text-accent">
            {skus.length}
          </p>
          {skus.length > 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              First: {skus[0]} · Last: {skus[skus.length - 1]}
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Configure a pattern and generate to see codes here.
            </p>
          )}
        </div>
        <ToolOutput
          label="Generated SKUs"
          value={skus.join("\n")}
          filename="product-skus.txt"
          rows={10}
        />
      </div>
    </div>
  );
}
