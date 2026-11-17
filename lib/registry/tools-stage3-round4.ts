import type { Tool } from "@/types/tool";

/** Stage 3, Round 4 tools (Profit Margin Calculator already exists as ready). */
export const stage3Round4Tools: Tool[] = [
  {
    slug: "discount-calculator",
    title: "Discount Calculator",
    description:
      "Calculate sale prices and savings from a discount percentage, or work backwards from a sale price to the original. Clear results with a copyable summary.",
    category: "business-finance",
    keywords: ["discount calculator", "sale price calculator", "percent off calculator", "reverse discount", "savings calculator"],
    icon: "Tag",
    status: "ready",
    popularity: 87,
    addedAt: "2026-11-19",
    related: ["percentage-calculator", "vat-calculator", "profit-margin-calculator"],
    content: {
      what: "The Discount Calculator handles both directions of a discount question. In forward mode it takes an original price and a discount percentage and returns the amount saved and the sale price. In reverse mode it starts from a discounted price and reconstructs the original price. The result summary can be copied or downloaded.",
      howTo: [
        "Choose whether you know the original price or the sale price.",
        "Enter the known price and the discount percentage.",
        "Click Calculate to see the other price and the amount saved.",
        "Copy or download the summary for your records.",
      ],
      example:
        "An $80 item discounted by 25% saves $20 and sells for $60. In reverse, a $75 sale price with a 25% discount implies an original price of $100.",
      benefits: [
        "Check store discounts before paying at the register.",
        "Reconstruct list prices from sale prices.",
        "Formula and amounts are shown, not just a final number.",
        "Runs locally on your device with no account.",
      ],
      faqs: [
        {
          q: "Can I apply two discounts in a row?",
          a: "Run the tool twice: apply the first discount, then use the result as the input for the second. Successive percentages are not simply added together.",
        },
        {
          q: "Why can't I reverse a 100% discount?",
          a: "A fully discounted item has a sale price of zero, which gives no information about the original price. The tool reports this as an error.",
        },
        {
          q: "Does it include tax?",
          a: "No. Discounts are applied to the pre-tax price. Use the VAT Calculator afterward if tax applies in your jurisdiction.",
        },
        {
          q: "How are prices rounded?",
          a: "Calculations use full precision and displayed values are rounded to two decimal places, which matches normal currency presentation.",
        },
      ],
    },
  },
  {
    slug: "vat-calculator",
    title: "VAT Calculator",
    description:
      "Add or remove VAT from an amount using your own rate. See net, VAT and gross values side by side, with a copyable result summary.",
    category: "business-finance",
    keywords: ["vat calculator", "add vat", "remove vat", "tax calculator", "gross net calculator"],
    icon: "Receipt",
    status: "ready",
    popularity: 84,
    addedAt: "2026-11-19",
    related: ["discount-calculator", "percentage-calculator", "profit-margin-calculator"],
    content: {
      what: "The VAT Calculator works in two directions. Add VAT turns a net amount into a gross amount by applying your entered rate; remove VAT extracts the net amount and VAT portion from a gross price. The three values are shown together, and a text summary can be copied or downloaded. No tax rate is assumed — you supply the rate that applies to you.",
      howTo: [
        "Choose Add VAT if your amount excludes tax, or Remove VAT if it includes tax.",
        "Enter the amount and your jurisdiction's VAT rate.",
        "Click Calculate and review net, VAT and gross figures.",
        "Copy or download the summary for an invoice or receipt.",
      ],
      example:
        "A net amount of $100 with 10% VAT gives $10 of VAT and a $110 gross amount. Removing 10% VAT from $110 returns a $100 net amount.",
      benefits: [
        "Prepare invoice figures without mental arithmetic.",
        "Verify that a quoted price includes or excludes tax.",
        "Works with any user-supplied rate, including zero.",
        "No uploads, no stored financial data.",
      ],
      faqs: [
        {
          q: "Which VAT rate should I use?",
          a: "Rates differ by country and by product. Enter the rate that applies to your situation; the default of 10% is only a starting example.",
        },
        {
          q: "Does it handle reduced or zero-rated items?",
          a: "Yes. Enter the correct reduced rate or 0% for exempt items. The tool simply applies the percentage you provide.",
        },
        {
          q: "Why do the numbers sometimes show tiny decimals?",
          a: "Floating-point arithmetic can produce values like 99.99999999999999. Displayed values are rounded to two decimal places, which is correct for currency.",
        },
        {
          q: "Is this tax advice?",
          a: "No. It is arithmetic only. Check local rules and exemptions with a qualified accountant or your tax authority.",
        },
      ],
    },
  },
];
