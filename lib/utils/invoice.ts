/** Pure invoice calculations and plain-text export. No React, no network. */

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  number: string;
  issueDate: string;
  dueDate: string;
  fromName: string;
  fromAddress: string;
  toName: string;
  toAddress: string;
  items: InvoiceItem[];
  taxRate: number;
  discount: number;
  currency: string;
  notes: string;
}

export interface InvoiceTotals {
  subtotal: number;
  discount: number;
  taxable: number;
  tax: number;
  total: number;
}

const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

export function createItem(): InvoiceItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    description: "",
    quantity: 1,
    unitPrice: 0,
  };
}

export function createInvoice(): Invoice {
  const today = new Date().toISOString().slice(0, 10);
  return {
    number: `INV-${new Date().getFullYear()}-0001`,
    issueDate: today,
    dueDate: today,
    fromName: "",
    fromAddress: "",
    toName: "",
    toAddress: "",
    items: [createItem()],
    taxRate: 0,
    discount: 0,
    currency: "USD",
    notes: "Thank you for your business.",
  };
}

export function computeTotals(invoice: Invoice): InvoiceTotals {
  const subtotal = invoice.items.reduce((sum, item) => {
    const quantity = Number.isFinite(item.quantity) ? Math.max(0, item.quantity) : 0;
    const price = Number.isFinite(item.unitPrice) ? Math.max(0, item.unitPrice) : 0;
    return sum + quantity * price;
  }, 0);
  const discount = Math.min(subtotal, Math.max(0, Number(invoice.discount) || 0));
  const taxable = Math.max(0, subtotal - discount);
  const tax = (taxable * (Math.max(0, Number(invoice.taxRate) || 0))) / 100;
  return {
    subtotal: round2(subtotal),
    discount: round2(discount),
    taxable: round2(taxable),
    tax: round2(tax),
    total: round2(taxable + tax),
  };
}

export function formatMoney(amount: number, currency = "USD"): string {
  const value = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

export function buildInvoiceText(invoice: Invoice): string {
  const totals = computeTotals(invoice);
  const money = (amount: number) => formatMoney(amount, invoice.currency);
  const lines: string[] = [];
  lines.push(`INVOICE ${invoice.number}`);
  lines.push(`Issued: ${invoice.issueDate}   Due: ${invoice.dueDate}`);
  lines.push("");
  lines.push(`FROM: ${invoice.fromName || "-"}`);
  if (invoice.fromAddress) lines.push(invoice.fromAddress);
  lines.push(`BILL TO: ${invoice.toName || "-"}`);
  if (invoice.toAddress) lines.push(invoice.toAddress);
  lines.push("");
  lines.push("DESCRIPTION".padEnd(34) + "QTY".padStart(6) + "RATE".padStart(12) + "AMOUNT".padStart(14));
  lines.push("-".repeat(66));
  for (const item of invoice.items) {
    const qty = Number.isFinite(item.quantity) ? Math.max(0, item.quantity) : 0;
    const price = Number.isFinite(item.unitPrice) ? Math.max(0, item.unitPrice) : 0;
    const amount = round2(qty * price);
    const label = (item.description || "Item").slice(0, 32);
    lines.push(label.padEnd(34) + String(qty).padStart(6) + money(price).padStart(12) + money(amount).padStart(14));
  }
  lines.push("-".repeat(66));
  lines.push(`Subtotal: ${money(totals.subtotal)}`);
  if (totals.discount > 0) lines.push(`Discount: -${money(totals.discount)}`);
  if (totals.tax > 0) lines.push(`Tax (${invoice.taxRate}%): ${money(totals.tax)}`);
  lines.push(`TOTAL: ${money(totals.total)}`);
  if (invoice.notes) {
    lines.push("");
    lines.push(invoice.notes);
  }
  return lines.join("\n");
}
