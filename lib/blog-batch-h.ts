import type { BlogPost } from "@/lib/blog";

/** Batch H guide linking to the five e-commerce tools in this batch. */
export const batchHBlogs: BlogPost[] = [
  {
    slug: "pricing-an-online-store",
    title:
      "Pricing an Online Store: Break-even, Fees, Profit, Wholesale and SKUs",
    description:
      "A practical guide to the five numbers every online seller needs: break-even units, real net payout after fees, true profit, wholesale pricing and clean product codes.",
    date: "2026-11-22",
    readingMinutes: 8,
    tags: ["E-commerce", "Pricing", "Business", "Finance"],
    content: `Running an online store means making a handful of decisions over and over: what to charge, what to pay suppliers, which marketplace to sell on and how to keep a growing catalogue organised. Get those decisions right and a store can be genuinely profitable. Get them wrong and revenue can look impressive while the bank balance tells a very different story. This guide walks through five practical calculations that turn vague guesses into numbers you can trust, and shows how to do each one in seconds.

## Start with the unit economics

Before you worry about monthly totals, understand a single unit. The key idea is contribution margin: the selling price minus the variable cost of delivering one more unit. That margin is the money available to cover your fixed costs. Once those fixed costs are covered, every additional unit contributes to profit.

Divide total fixed costs by contribution margin per unit and you get the break-even point, the number of units you must sell before the business stops losing money. The [Break-even Calculator](/tools/break-even-calculator) does this arithmetic for you and rounds up to the first whole unit you can actually sell. Try changing the price in the tool and watch how a small increase can dramatically reduce the sales target. That sensitivity is exactly why break-even analysis is so useful when you are deciding whether a discount or a promotion is worth running.

Remember to distinguish fixed from variable costs honestly. Rent, software subscriptions and salaries are usually fixed. Materials, packaging and per-order payment charges are variable. Misclassifying one as the other will make the result misleading.

## Find out what the marketplace really pays you

A sale price is not the amount that lands in your account. Marketplaces subtract referral fees, payment processing fees, promotion charges and sometimes flat per-order costs. Different channels use different schedules, and those schedules change over time, so relying on a remembered percentage is a common source of budgeting errors.

The [Marketplace Fee Calculator](/tools/marketplace-fee-calculator) deliberately ships with no built-in rates. You enter the fees from your own fee schedule, name each one and add as many lines as you need. It returns a net payout and a full breakdown, plus an effective fee rate that expresses all deductions as a single percentage of the sale. That effective rate is the number to use when comparing channels: a marketplace with a higher headline referral fee may still pay more once other charges are considered. Feed those net amounts back into your unit economics rather than the gross sale price.

## Look at profit after every cost

Break-even tells you the minimum. Profit tells you how the business is actually performing. Gross margin alone is an optimistic figure because it ignores shipping, advertising, platform fees and returns, all of which can be substantial in e-commerce.

The [E-commerce Profit Calculator](/tools/ecommerce-profit-calculator) builds a simple profit statement from six inputs: revenue, cost of goods sold, shipping, advertising, fees and returns. It subtracts them all and reports net profit, profit margin, total costs and a cost ratio showing what share of revenue is consumed. If advertising alone eats a large slice of revenue, that is visible immediately. If returns are creeping upward, the statement makes it obvious. Run the calculation for consistent periods, such as calendar months, and track the margin over time. A store with steadily rising revenue but a falling margin has a problem that top-line growth is hiding.

For a fair picture, include an owner's salary as a cost. A business that only pays its owner through leftover profit may be less healthy than the numbers suggest.

## Work backwards from the retail shelf

Sometimes you know the price a customer will pay before you know what you can afford to sell the product for. This is common when supplying independent retailers or preparing a wholesale line sheet. Rather than guessing, work backwards from the target retail price.

The [Wholesale Price Calculator](/tools/wholesale-price-calculator) supports three models. Keystone pricing sets retail at twice wholesale, giving a 50 percent retailer margin. A custom margin model lets you choose the share of retail the retailer keeps, which produces a lower wholesale price when they need a bigger cut. A markup model starts from the wholesale price and adds a percentage to reach retail. The tool also clarifies the difference between margin and markup, two terms that are frequently mixed up and can lead to an underpriced quote. Once you have a wholesale price, compare it with your real production and overhead costs to confirm the margin works for you.

## Organise the catalogue with clean codes

Good pricing is wasted if your products are hard to track. As a catalogue grows, names alone become ambiguous: similar variants, duplicate listings and inconsistent abbreviations all cause mistakes. A structured stock keeping unit, or SKU, solves this by encoding useful information into a short, unique code.

The [Product SKU Generator](/tools/product-sku-generator) builds codes from a prefix, a category code, a separator, an optional suffix and a zero-padded sequence. Because the numbers increase strictly and the tool checks for collisions, codes in a batch are guaranteed to be unique. You can generate up to 100 at a time and download a CSV to import straight into a store platform or spreadsheet. Keep the pattern meaningful but not overly long: a code like ACME-TSHIRT-0001 communicates brand, category and sequence at a glance.

## Put the five numbers into a routine

These calculations are most valuable when they become a habit. A simple monthly routine works well. Review unit economics and confirm the break-even target still makes sense. Recalculate net payout for each channel using current fee schedules. Produce a profit statement and note the margin trend. If you are adding a wholesale line, derive prices from realistic retail targets. Finally, generate SKUs for every new product before it goes live so the catalogue stays tidy from day one.

None of this requires specialist software or a finance degree. It requires consistent inputs and a willingness to look at the uncomfortable numbers as well as the flattering ones. Use the five tools above to make each step quick, then spend the time you save acting on what the figures tell you. That is the difference between a store that is busy and a store that is genuinely profitable.`,
  },
];
