import type { BlogPost } from "@/lib/blog";

/** Batch I guide covering the five e-commerce tools. */
export const batchIBlogs: BlogPost[] = [
  {
    slug: "ecommerce-operations-guide-barcodes-shipping-inventory-pricing",
    title: "Running a Small E-commerce Store: Barcodes, Shipping, Inventory, Pricing and Returns",
    description:
      "A practical operations guide for small online sellers: generate real barcodes, quote shipping by chargeable weight, plan reorder points, run a sale and write a return policy.",
    date: "2026-11-22",
    readingMinutes: 9,
    tags: ["E-commerce", "Operations", "Inventory", "Pricing"],
    content: `Selling online is more than putting up a product page and waiting for orders. The stores that stay profitable are the ones that get the unglamorous operations right: identifiers that scan, shipping quotes that match reality, stock that arrives before you run out, a pricing plan that protects margin, and a returns process customers trust. This guide walks through those five pillars and shows how to handle each one with a free browser tool that keeps your data on your own device.

## Start with identifiers that actually scan

Every product needs an identifier that survives the journey from your shelf to a carrier's scanning device. For general internal use, Code 128 is the workhorse: it encodes text and numbers, and it can pack long digit strings efficiently. For retail products sold through marketplaces and physical shops, EAN-13 is the global standard.

The tricky part is the EAN-13 check digit, the final digit that lets a scanner detect a mistyped number. It is calculated by weighting alternating digits by one and three, taking the sum modulo ten and subtracting from ten. Getting it wrong means a barcode that looks fine but never scans. The [Barcode Generator](/tools/barcode-generator) does this math for you: enter twelve digits and it computes and appends the correct check digit, or enter thirteen and it validates the final character. It draws the result into a canvas and can export both PNG for print and SVG for anything that needs to scale, from tiny stickers to a large warehouse label.

When you print, remember that quiet zones and contrast matter as much as the bars themselves. Keep at least ten modules of blank space at each end, use dark bars on a light background, and choose a module width your printer can reproduce cleanly. A barcode that fails to scan at the till is a customer service problem you can prevent at design time.

## Quote shipping from chargeable weight, not just scale weight

One of the most common surprises for new sellers is being billed for a parcel that feels light. Carriers price on **chargeable weight**, which is the greater of the parcel's actual weight and its volumetric weight. Volumetric weight represents the space the box occupies: length times width times height, divided by a carrier-specific divisor such as 5000 or 6000.

That means a box of pillows can cost more to ship than a dense box of the same scale weight. Before you quote a customer or choose packaging, run the numbers. The [Shipping Cost Calculator](/tools/shipping-cost-calculator) takes dimensions, scale weight, a rate per kilogram and the divisor from your carrier's rate card. It shows the parcel volume, both candidate weights, which one governs and the estimated base cost. If a bulky box is being billed on volumetric weight, downsizing the packaging can cut the bill immediately. Treat the number as a base estimate: fuel surcharges, residential delivery fees and zone pricing sit on top in a real invoice.

## Know when to reorder, and how much

Stockouts lose sales; overstock ties up cash and storage. The fix is a small set of inventory rules that you can recalculate whenever demand changes. Three figures do most of the work:

- **Safety stock** is a buffer for uncertainty. It grows when daily demand fluctuates, when supplier lead time fluctuates, and when you want a higher service level.
- **Reorder point** is the stock level that triggers a new order: expected demand during lead time plus safety stock.
- **Economic order quantity (EOQ)** balances the cost of placing orders against the cost of holding stock. Order too often and you waste administrative effort; order too much and you pay to store it.

The [Inventory Calculator](/tools/inventory-calculator) computes all three from annual demand, working days, lead time, a service-level z-score, the standard deviations of demand and lead time, and your ordering and holding costs. It prints the formulas next to the answers, so you can see exactly where each number came from. If your demand and lead time are perfectly steady, set both standard deviations to zero and safety stock disappears. In the real world a small buffer is wise. Revisit the figures quarterly, or whenever a supplier changes their lead time, because a reorder point built on last year's demand will drift out of date.

## Price a sale without guessing

Discounts are a normal part of retail, but applying them line by line across a catalogue is tedious and error-prone. A single misplaced decimal can turn a twenty percent reduction into a seventy percent one. Decide whether the campaign is a percentage off or a fixed amount off, work out the sale price for every item, and keep a clean record you can import back into your store.

The [Discount Price Generator](/tools/discount-price-generator) accepts a pasted list of products and prices, applies one discount across the whole list, and previews the original price, discount amount and sale price for each row. It also totals your savings and the final sale value. When the numbers look right, download the CSV: it has a header row, escaped product names and a total row, so it drops straight into a spreadsheet or store importer. If a fixed discount would push a low-priced item below zero, the tool floors the price at zero and caps the discount, which is your cue to review that item manually. Always check the sale price against your margin before publishing; a discount that wins orders but loses money is not a promotion, it is a donation.

## Set return terms people can understand

Returns are inevitable, and a clear policy turns a potentially frustrating experience into a reason to trust a store. A good policy says how long customers have to return an item, what condition it must be in, who pays return shipping, how refunds are issued and how to start the process. It should also cover damaged or incorrect goods explicitly, because those cases are usually free for the customer.

The [Return Policy Generator](/tools/return-policy-generator) assembles those sections from a short form. You enter the store name, return window, shipping payer, refund method, any restocking fee and a contact email, and it writes a structured Markdown document you can copy or download. It also shows a prominent notice that the text is a starting point and **not legal advice**. Consumer-protection rules vary widely by jurisdiction and product category, so have a qualified professional review the result and add any mandatory local terms before you publish. Finally, make sure your team can honour what the policy promises: a generous window is only generous if you can actually process returns within it.

## Bring the pieces together

These five areas reinforce each other. Accurate barcodes make receiving and fulfilment faster. Honest shipping quotes reduce abandoned carts and refund requests. Reliable reorder points keep popular items in stock. A disciplined sale pricing process protects margin. A fair return policy removes the last hesitation before checkout.

None of it requires an expensive suite or a subscription. The tools linked here run in the browser, work with the numbers you already have, and export files you can take anywhere. Pick the one that solves your most urgent problem today, then come back to the next. Small operational improvements compound: a few minutes saved per order and a few avoided stockouts add up to a noticeably healthier business over a year.`,
  },
];
