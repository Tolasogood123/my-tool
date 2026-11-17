"use client";

import { useState } from "react";
import { Download, FileText, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { downloadText } from "@/lib/utils/download";
import {
  buildInvoiceText,
  computeTotals,
  createInvoice,
  createItem,
  formatMoney,
  type Invoice,
  type InvoiceItem,
} from "@/lib/utils/invoice";

const PRINT_STYLES = `
@media print {
  body * { visibility: hidden !important; }
  #invoice-print, #invoice-print * { visibility: visible !important; }
  #invoice-print { position: absolute; left: 0; top: 0; width: 100%; }
}`;

export function InvoiceGenerator() {
  const [invoice, setInvoice] = useState<Invoice>(createInvoice);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const totals = computeTotals(invoice);

  const patch = (changes: Partial<Invoice>) => setInvoice((current) => ({ ...current, ...changes }));
  const patchItem = (id: string, changes: Partial<InvoiceItem>) =>
    setInvoice((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    }));
  const addItem = () => setInvoice((current) => ({ ...current, items: [...current.items, createItem()] }));
  const removeItem = (id: string) =>
    setInvoice((current) => ({
      ...current,
      items: current.items.length > 1 ? current.items.filter((item) => item.id !== id) : current.items,
    }));

  const download = () => {
    downloadText(buildInvoiceText(invoice), `${invoice.number || "invoice"}.txt`, "text/plain;charset=utf-8");
    toast({ title: "Invoice downloaded", variant: "success" });
  };

  const print = () => {
    if (!invoice.toName.trim()) {
      setError("Add a client name before printing.");
      return;
    }
    setError(null);
    window.print();
  };

  const reset = () => {
    setInvoice(createInvoice());
    setError(null);
  };

  const money = (amount: number) => formatMoney(amount, invoice.currency);

  return (
    <div className="space-y-6">
      <style>{PRINT_STYLES}</style>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Invoice number" htmlFor="inv-number">
              <Input id="inv-number" value={invoice.number} onChange={(event) => patch({ number: event.target.value })} />
            </Field>
            <Field label="Currency" htmlFor="inv-currency">
              <Input id="inv-currency" value={invoice.currency} maxLength={3} onChange={(event) => patch({ currency: event.target.value.toUpperCase() })} placeholder="USD" />
            </Field>
            <Field label="Issue date" htmlFor="inv-issue">
              <Input id="inv-issue" type="date" value={invoice.issueDate} onChange={(event) => patch({ issueDate: event.target.value })} />
            </Field>
            <Field label="Due date" htmlFor="inv-due">
              <Input id="inv-due" type="date" value={invoice.dueDate} onChange={(event) => patch({ dueDate: event.target.value })} />
            </Field>
          </div>

          <Field label="From (your business)" htmlFor="inv-from">
            <Textarea id="inv-from" rows={3} value={invoice.fromName} onChange={(event) => patch({ fromName: event.target.value })} placeholder="Your name or company" />
          </Field>
          <Field label="Bill to (client)" htmlFor="inv-to">
            <Textarea id="inv-to" rows={3} value={invoice.toName} onChange={(event) => patch({ toName: event.target.value })} placeholder="Client name or company" />
          </Field>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Line items</h3>
              <Button size="sm" variant="outline" onClick={addItem}>
                <Plus className="size-3.5" aria-hidden="true" /> Add item
              </Button>
            </div>
            {invoice.items.map((item, index) => (
              <div key={item.id} className="rounded-control border border-border bg-surface p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Item {index + 1}</span>
                  <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)} aria-label={`Remove item ${index + 1}`}>
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>
                <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_80px_100px]">
                  <Input aria-label={`Description for item ${index + 1}`} value={item.description} onChange={(event) => patchItem(item.id, { description: event.target.value })} placeholder="Description" />
                  <Input aria-label={`Quantity for item ${index + 1}`} type="number" min={0} step="0.01" value={item.quantity} onChange={(event) => patchItem(item.id, { quantity: Number(event.target.value) })} />
                  <Input aria-label={`Unit price for item ${index + 1}`} type="number" min={0} step="0.01" value={item.unitPrice} onChange={(event) => patchItem(item.id, { unitPrice: Number(event.target.value) })} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tax rate (%)" htmlFor="inv-tax">
              <Input id="inv-tax" type="number" min={0} step="0.01" value={invoice.taxRate} onChange={(event) => patch({ taxRate: Number(event.target.value) })} />
            </Field>
            <Field label={`Discount (${invoice.currency})`} htmlFor="inv-discount">
              <Input id="inv-discount" type="number" min={0} step="0.01" value={invoice.discount} onChange={(event) => patch({ discount: Number(event.target.value) })} />
            </Field>
          </div>
          <Field label="Notes" htmlFor="inv-notes">
            <Textarea id="inv-notes" rows={2} value={invoice.notes} onChange={(event) => patch({ notes: event.target.value })} />
          </Field>

          <div className="flex flex-wrap gap-3">
            <Button onClick={print}>
              <Printer className="size-4" aria-hidden="true" />
              Print / Save PDF
            </Button>
            <Button variant="outline" onClick={download}>
              <Download className="size-4" aria-hidden="true" />
              Download .txt
            </Button>
            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset
            </Button>
          </div>
          {error ? <ErrorState title="Before you print" description={error} /> : null}
        </div>

        <div id="invoice-print" className="rounded-card border border-border bg-surface p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Invoice</p>
              <h3 className="mt-1 text-2xl font-bold">{invoice.number || "Draft"}</h3>
            </div>
            <FileText className="size-7 text-accent" aria-hidden="true" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">From</p>
              <p className="mt-1 whitespace-pre-wrap font-medium">{invoice.fromName || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bill to</p>
              <p className="mt-1 whitespace-pre-wrap font-medium">{invoice.toName || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Issued</p>
              <p className="mt-1">{invoice.issueDate}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Due</p>
              <p className="mt-1">{invoice.dueDate}</p>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                  <th className="py-2">Description</th>
                  <th className="py-2 text-right">Qty</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-border/60">
                    <td className="py-2 pr-2">{item.description || "Item"}</td>
                    <td className="py-2 text-right tabular-nums">{item.quantity}</td>
                    <td className="py-2 text-right tabular-nums">{money(item.unitPrice)}</td>
                    <td className="py-2 text-right tabular-nums">{money(Math.max(0, item.quantity) * Math.max(0, item.unitPrice))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 ml-auto w-full max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{money(totals.subtotal)}</span></div>
            {totals.discount > 0 ? <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="tabular-nums">-{money(totals.discount)}</span></div> : null}
            {totals.tax > 0 ? <div className="flex justify-between"><span className="text-muted-foreground">Tax ({invoice.taxRate}%)</span><span className="tabular-nums">{money(totals.tax)}</span></div> : null}
            <div className="flex justify-between border-t border-border pt-2 text-lg font-bold"><span>Total</span><span className="tabular-nums">{money(totals.total)}</span></div>
          </div>
          {invoice.notes ? <p className="mt-6 text-sm text-muted-foreground">{invoice.notes}</p> : null}
        </div>
      </div>
    </div>
  );
}
