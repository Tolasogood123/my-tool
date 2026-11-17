import type { Tool } from "@/types/tool";

/** Batch I, e-commerce tools 11–15. */
export const batchITools: Tool[] = [
  {
    slug: "barcode-generator",
    title: "Barcode Generator",
    description:
      "Create scannable Code 128 or EAN-13 barcodes from text or product numbers. Preview on canvas, verify the EAN-13 check digit and download crisp PNG or scalable SVG files.",
    category: "e-commerce",
    keywords: ["barcode generator", "Code 128 generator", "EAN-13 barcode", "product barcode maker", "barcode download PNG SVG", "retail barcode creator"],
    icon: "BarChart3",
    status: "ready",
    popularity: 84,
    addedAt: "2026-11-22",
    related: ["qr-code-generator", "inventory-calculator", "discount-price-generator"],
    content: {
      what: "The Barcode Generator turns a value you type into a real, scannable barcode entirely in your browser. It supports Code 128 for arbitrary text and numbers, plus EAN-13 for retail product identifiers. Code 128 automatically uses the compact numeric Code C set when you enter an even-length string of digits, and otherwise uses Code B for printable text. For EAN-13, the tool validates the check digit and can compute and append it when you supply the twelve-digit base. The resulting module pattern is drawn to a canvas for a sharp preview and can be downloaded as a lossless PNG or a scalable SVG.",
      howTo: [
        "Choose Code 128 for general text or EAN-13 for a 13-digit retail identifier.",
        "Enter the value, or enter 12 EAN-13 digits and let the tool add the check digit.",
        "Adjust module width, height, colours and the text label to suit your label stock.",
        "Click Generate barcode, then download a PNG for print or an SVG for scaling.",
      ],
      example:
        "A small shop lists a new product with the twelve-digit base 590123412345. They choose EAN-13 and enter that number; the tool appends the correct check digit 7, producing 5901234123457, and they download a 600-pixel-wide PNG to print on shelf labels.",
      benefits: [
        "Generates genuine Code 128 and EAN-13 symbologies without a paid service.",
        "Validates EAN-13 check digits so you catch typos before printing.",
        "SVG export stays crisp at any size, from stickers to large labels.",
        "Everything runs locally; product data is never uploaded.",
      ],
      faqs: [
        {
          q: "What characters can Code 128 encode here?",
          a: "This implementation supports printable ASCII characters from space through tilde. An even-length string of digits is encoded with the denser Code C set; other values use Code Set B. Extended Code A control characters and FNC functions are not exposed in the interface.",
        },
        {
          q: "How is the EAN-13 check digit calculated?",
          a: "Digits in odd positions are weighted by 1 and digits in even positions by 3. The check digit is (10 − (sum mod 10)) mod 10. Enter twelve digits and the generator computes it for you, or enter thirteen and the tool verifies the final digit.",
        },
        {
          q: "Why does my scanner fail to read a printed barcode?",
          a: "Most failures come from low contrast, quiet zones that are too narrow, or bars that are too thin for the printer. Use dark bars on a light background, keep at least ten modules of blank space on each side (the tool includes this), and increase the module width.",
        },
        {
          q: "Can I resize the SVG without losing quality?",
          a: "Yes. The SVG uses vector rectangles, so it scales cleanly. At very large print sizes the human-readable text is still sized in pixels relative to the viewBox; increase the text setting if it looks small on a big label.",
        },
      ],
    },
  },
  {
    slug: "shipping-cost-calculator",
    title: "Shipping Cost Calculator",
    description:
      "Compare volumetric and actual parcel weight and see the chargeable weight a carrier will bill. Enter dimensions, scale weight, a rate per kilogram and a divisor to estimate shipping cost.",
    category: "e-commerce",
    keywords: ["shipping cost calculator", "volumetric weight calculator", "chargeable weight calculator", "parcel shipping estimate", "dimensional weight calculator", "freight cost calculator"],
    icon: "Calculator",
    status: "ready",
    popularity: 76,
    addedAt: "2026-11-22",
    related: ["profit-margin-calculator", "vat-calculator", "barcode-generator"],
    content: {
      what: "Carriers charge for the greater of a parcel's real weight and its volumetric (dimensional) weight. This calculator takes the box dimensions, the scale weight, a rate per chargeable kilogram and the carrier's volumetric divisor. It computes the parcel volume, derives the volumetric weight, identifies which basis applies, and shows the resulting estimated cost. It is useful for quoting customers, comparing packaging options and understanding why a light but bulky box costs more than expected.",
      howTo: [
        "Measure the parcel's length, width and height in centimetres.",
        "Enter its actual scale weight and your carrier's rate per kilogram.",
        "Choose the volumetric divisor used by your carrier, commonly 5000 or 6000.",
        "Click Calculate shipping to see volumetric, actual and chargeable weight plus the cost.",
      ],
      example:
        "A box measuring 40 × 30 × 20 cm has a volume of 24,000 cm³. With a divisor of 5000 its volumetric weight is 4.8 kg. If it weighs 2 kg on the scales and the rate is $6.50 per kg, the chargeable weight is 4.8 kg and the estimated cost is $31.20.",
      benefits: [
        "Shows whether size or scale weight drives the shipping charge.",
        "Helps compare packaging choices before you commit to a box.",
        "Supports the common 5000, 6000 and conservative 4000 divisors.",
        "Produces a copyable summary you can paste into a customer quote.",
      ],
      faqs: [
        {
          q: "What is volumetric weight?",
          a: "It is an artificial weight derived from the space a parcel occupies: length × width × height divided by the carrier's divisor. It stops very light, bulky items from being shipped cheaply relative to the space they take in a vehicle.",
        },
        {
          q: "Which divisor should I use?",
          a: "Use the one published by your carrier. 5000 is common for express parcel services when dimensions are in centimetres and weight in kilograms; some carriers use 6000 or 4000. Check your rate card because the divisor directly changes the result.",
        },
        {
          q: "Does this include fuel surcharges or residential fees?",
          a: "No. The estimate is chargeable weight multiplied by your rate per kilogram only. Taxes, surcharges, handling, insurance and zone-based pricing are not modelled, so treat the figure as a base estimate.",
        },
        {
          q: "What if the two weights are identical?",
          a: "The chargeable weight is that shared value, so the cost is the same either way. The tool reports the basis as equal so it is clear there is no bulk penalty on the parcel.",
        },
      ],
    },
  },
  {
    slug: "inventory-calculator",
    title: "Inventory Calculator",
    description:
      "Compute reorder point, safety stock and economic order quantity from demand, lead time and costs. See the formulas and supporting figures behind each number for smarter restocking decisions.",
    category: "e-commerce",
    keywords: ["inventory calculator", "reorder point calculator", "safety stock calculator", "EOQ calculator", "economic order quantity", "stock replenishment planner"],
    icon: "CheckSquare",
    status: "ready",
    popularity: 74,
    addedAt: "2026-11-22",
    related: ["profit-margin-calculator", "discount-calculator", "shipping-cost-calculator"],
    content: {
      what: "The Inventory Calculator turns a few operational inputs into the three numbers most small businesses need for restocking: how much safety stock to hold, at what stock level to reorder, and how much to order each time. Safety stock accounts for variability in both daily demand and supplier lead time at your chosen service level. The economic order quantity balances ordering costs against holding costs. Every formula is shown alongside the result so you can understand and defend the numbers.",
      howTo: [
        "Enter annual demand, working days per year and the supplier lead time in days.",
        "Choose a service level, which maps to a z-score such as 1.65 for 95 percent.",
        "Add the standard deviation of daily demand and of lead time; use zero if either is steady.",
        "Enter the cost per order and the annual holding cost per unit, then click Calculate.",
      ],
      example:
        "A shop sells 1,200 units a year with a 7-day lead time and a 95 percent service target. Daily demand varies with a standard deviation of 2 units and lead time varies by about a day, giving roughly 10 units of safety stock and a reorder point near 33 units; with a $50 order cost and $4 annual holding cost, the EOQ is about 173 units per order.",
      benefits: [
        "Combines demand and lead-time variability in one safety-stock figure.",
        "Makes the reorder point explicit so staff know when to place an order.",
        "Balances ordering and holding costs with the classic EOQ formula.",
        "Shows every formula and intermediate value for transparent decisions.",
      ],
      faqs: [
        {
          q: "What does the service level z-score mean?",
          a: "It is the number of standard deviations of demand during lead time that your safety stock should cover. A higher z-score means fewer stockouts but more inventory. Common choices are 1.28 for 90 percent, 1.65 for 95 percent and 2.33 for 99 percent.",
        },
        {
          q: "What if my demand or lead time never varies?",
          a: "Set both standard deviations to zero. Safety stock then becomes zero and the reorder point equals average demand during lead time. Any real-world variability is not captured, so consider a small buffer anyway.",
        },
        {
          q: "Does EOQ include quantity discounts or storage limits?",
          a: "No. The basic EOQ model assumes a constant unit price, constant demand and no capacity constraints. Supplier discounts, minimum order quantities and shelf life can all change the optimal order size.",
        },
        {
          q: "Which units should the costs use?",
          a: "Use the same currency for the ordering cost and the holding cost, and express holding cost per unit per year. Annual demand and daily demand should refer to the same unit, such as individual pieces rather than cartons.",
        },
      ],
    },
  },
  {
    slug: "return-policy-generator",
    title: "Return Policy Generator",
    description:
      "Build a clear, customizable return and refund policy for your online store. Set the window, shipping and refund terms, then copy or download a Markdown policy in seconds.",
    category: "e-commerce",
    keywords: ["return policy generator", "refund policy template", "ecommerce return policy", "return policy maker", "store return terms", "refund policy builder"],
    icon: "FileText",
    status: "ready",
    popularity: 73,
    addedAt: "2026-11-22",
    related: ["schema-markup-generator", "robots-generator", "discount-price-generator"],
    content: {
      what: "The Return Policy Generator assembles a readable return and refund policy from a short form. You provide the store name, return window, who pays return shipping, the refund method, any restocking fee, a contact email and the conditions items must meet. The tool writes a structured Markdown document with sections for the return window, item condition, shipping, refunds, how to start a return and damaged goods. A prominent notice reminds you that the output is a starting point and not legal advice, and the result can be copied or downloaded.",
      howTo: [
        "Fill in your store name, return window and a returns contact email.",
        "Choose who pays return shipping and how refunds are issued.",
        "Set a restocking fee if applicable and list the conditions for returns.",
        "Click Generate policy, review the text and copy or download the Markdown file.",
      ],
      example:
        "An online shop with a 30-day window, store-paid return shipping, refunds to the original payment method and no restocking fee generates a complete policy, then pastes it into its help centre and links it from checkout.",
      benefits: [
        "Produces a complete, consistently structured policy from simple inputs.",
        "Includes a clear not-legal-advice notice to encourage proper review.",
        "Markdown output is easy to publish in a help centre or static site.",
        "Copy and download options make it simple to share with a lawyer or team.",
      ],
      faqs: [
        {
          q: "Is the generated policy legally valid?",
          a: "Not necessarily. It is a general template and not legal advice. Consumer-protection rules differ by country, state and product type, so have a qualified professional review it and add any mandatory local terms before publishing.",
        },
        {
          q: "Can I edit the text after generating it?",
          a: "Yes. Copy or download the Markdown, then adjust any section to match your actual operations. Make sure your staff can honour whatever terms you publish, especially timelines and who pays shipping.",
        },
        {
          q: "Why do I need a returns contact email?",
          a: "Customers need a clear way to start a return. The generator inserts your email in the instructions and closing sections so the policy is actionable rather than just descriptive.",
        },
        {
          q: "What file format is downloaded?",
          a: "A UTF-8 Markdown file with a .md extension and headings you can paste into most help centres, wikis or static site generators. You can also copy the raw text directly to your clipboard.",
        },
      ],
    },
  },
  {
    slug: "discount-price-generator",
    title: "Discount Price Generator",
    description:
      "Apply a percentage or fixed discount to a bulk product price list and download the results as CSV. Preview original prices, savings and sale prices for every item instantly.",
    category: "e-commerce",
    keywords: ["discount price generator", "bulk price list tool", "sale price calculator", "CSV price list maker", "percent discount calculator", "fixed discount pricing"],
    icon: "Tag",
    status: "ready",
    popularity: 72,
    addedAt: "2026-11-22",
    related: ["discount-calculator", "vat-calculator", "barcode-generator"],
    content: {
      what: "The Discount Price Generator takes a plain-text list of products and prices, applies one discount across the whole list, and produces a ready-to-use sale price table. You can enter a percentage off or a fixed amount off, and the tool rounds each result to two decimal places. It reports the discount amount and sale price per item plus total savings and total sale value, then exports everything as CSV with a header row for spreadsheets and store imports.",
      howTo: [
        "Paste one product per line in the form “Product name, price”.",
        "Choose a percentage or fixed-amount discount and enter the value.",
        "Click Apply discount to preview the new prices and totals.",
        "Copy the CSV to your clipboard or download it as a file for your store or spreadsheet.",
      ],
      example:
        "A store pastes three items — T-Shirt 19.99, Hoodie 49.00 and Cap 14.50 — and applies a 20 percent discount. The sale prices become 15.99, 39.20 and 11.60, and the tool exports a CSV with the original price, discount amount and sale price for each row.",
      benefits: [
        "Handles an entire catalogue in one paste instead of calculating row by row.",
        "Supports both percentage and fixed-amount discount campaigns.",
        "Excludes nothing: every product line is validated and reported clearly.",
        "CSV output with a header row imports cleanly into spreadsheets and shops.",
      ],
      faqs: [
        {
          q: "What input format does the price list need?",
          a: "One item per line with the product name, then a comma or tab, then the price. Currency symbols and thousands separators should be removed. Blank lines are ignored, and any malformed line is reported with its line number.",
        },
        {
          q: "What happens if a fixed discount exceeds an item's price?",
          a: "The sale price is floored at zero, so the discount shown for that item is capped at its original price. The tool will not produce a negative price, but you should review such rows before publishing.",
        },
        {
          q: "Are the prices rounded?",
          a: "Yes. Discount amounts and sale prices are rounded to two decimal places, which is appropriate for most currencies. Because rounding happens per item, the displayed total is the sum of those rounded sale prices.",
        },
        {
          q: "Can I use the CSV in a spreadsheet or store import?",
          a: "Yes. It includes a header row with the original price, the applied discount and the sale price, plus a total row. Product names containing commas or quotes are escaped automatically so columns stay intact.",
        },
      ],
    },
  },
];
