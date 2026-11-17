/** Pure template builder for a clear, customizable e-commerce return policy. */

export type ReturnShippingPayer = "store" | "customer";
export type RefundMethod = "original-payment" | "store-credit" | "exchange";

export interface ReturnPolicyConfig {
  storeName: string;
  returnWindowDays: number;
  shippingPayer: ReturnShippingPayer;
  refundMethod: RefundMethod;
  restockingFeePercent: number;
  contactEmail: string;
  effectiveDate: string;
  conditions: string[];
  extraNotes: string;
}

export const NOT_LEGAL_ADVICE_NOTICE =
  "This template is a general starting point, not legal advice. Return and refund laws vary by country, state and product category. Review the text with a qualified professional and confirm it meets your local consumer-protection obligations before publishing it.";

/** Validates the template inputs, returning a human-readable error or null. */
export function validateReturnPolicyConfig(config: ReturnPolicyConfig): string | null {
  if (!config.storeName.trim()) return "Enter your store name.";
  if (!Number.isFinite(config.returnWindowDays) || config.returnWindowDays <= 0) {
    return "The return window must be a positive number of days.";
  }
  if (!/^\S+@\S+\.\S+$/.test(config.contactEmail.trim())) {
    return "Enter a valid contact email address.";
  }
  if (
    !Number.isFinite(config.restockingFeePercent) ||
    config.restockingFeePercent < 0 ||
    config.restockingFeePercent > 100
  ) {
    return "The restocking fee must be between 0% and 100%.";
  }
  return null;
}

function refundSentence(method: RefundMethod): string {
  switch (method) {
    case "store-credit":
      return "Approved returns are refunded as store credit, issued to the same account and valid for 12 months.";
    case "exchange":
      return "Approved returns are handled as an exchange for another item of equal or lesser value.";
    case "original-payment":
    default:
      return "Approved returns are refunded to the original payment method used for the purchase.";
  }
}

/** Builds a Markdown return policy from the supplied configuration. */
export function generateReturnPolicy(config: ReturnPolicyConfig): string {
  const error = validateReturnPolicyConfig(config);
  if (error) throw new Error(error);

  const store = config.storeName.trim();
  const conditions = config.conditions.map((item) => item.trim()).filter(Boolean);
  const conditionLines = conditions.length
    ? conditions.map((item) => `- ${item}`).join("\n")
    : "- Items are returned in their original, unused condition.\n- Original packaging and accessories are included.";

  const shippingLine =
    config.shippingPayer === "store"
      ? "We cover the cost of return shipping on approved returns. Use the prepaid label included with your order or contact us for one."
      : "Customers are responsible for return shipping costs unless the item arrived damaged, defective, or incorrect. In those cases we cover the shipping.";

  const feeLine =
    config.restockingFeePercent > 0
      ? `A restocking fee of ${config.restockingFeePercent}% may be deducted from the refund for returned items that are not in their original condition.`
      : "We do not charge a restocking fee on eligible returns.";

  const notes = config.extraNotes.trim()
    ? `\n## Additional notes\n\n${config.extraNotes.trim()}\n`
    : "";

  return [
    `# Return and Refund Policy — ${store}`,
    "",
    `**Effective date:** ${config.effectiveDate || "Not specified"}`,
    "",
    `> ${NOT_LEGAL_ADVICE_NOTICE}`,
    "",
    "## Return window",
    "",
    `You may request a return within ${config.returnWindowDays} days of receiving your order. After that period we are unable to accept routine returns, except where required by law.`,
    "",
    "## Condition of items",
    "",
    "To be eligible for a return, items must meet the following conditions:",
    "",
    conditionLines,
    "",
    "## Return shipping",
    "",
    shippingLine,
    "",
    "## Refunds",
    "",
    refundSentence(config.refundMethod),
    "",
    `Once your return is received and inspected, we will notify you of the outcome within 5 business days. ${feeLine}`,
    "",
    "## How to start a return",
    "",
    `Email ${config.contactEmail.trim()} with your order number and the reason for the return. We will reply with instructions and, where applicable, a return label. Please do not send items back before receiving our confirmation.`,
    "",
    "## Damaged or incorrect items",
    "",
    "If an item arrives damaged, defective, or different from what you ordered, contact us within 7 days of delivery with photos. We will arrange a replacement or refund at no additional cost to you.",
    notes,
    "---",
    "",
    `Questions about this policy? Contact ${store} at ${config.contactEmail.trim()}.`,
  ]
    .join("\n")
    .trim();
}
