import type { Tool } from "@/types/tool";

/** Batch H, tools 6-10. Replaces the former duplicate product price calculator. */
export const batchHTools: Tool[] = [
  {
    slug: "break-even-calculator",
    title: "Break-even Calculator",
    description:
      "Find how many units you must sell to cover costs. Enter fixed costs, variable cost per unit and price to see break-even units, revenue and contribution margin.",
    category: "e-commerce",
    keywords: [
      "break even calculator",
      "break even point",
      "contribution margin calculator",
      "break even analysis",
      "units to break even",
      "cost volume profit",
    ],
    icon: "Calculator",
    status: "ready",
    popularity: 78,
    addedAt: "2026-11-22",
    related: [
      "profit-margin-calculator",
      "ecommerce-profit-calculator",
      "wholesale-price-calculator",
      "discount-calculator",
    ],
    content: {
      what: "The Break-even Calculator answers a fundamental business question: how many units must I sell before the business stops losing money? It divides your total fixed costs by the contribution margin per unit (selling price minus variable cost) to find the break-even point. It reports both the exact fractional result and the whole number of units you actually need to sell, plus the revenue that represents. Everything runs locally in your browser.",
      howTo: [
        "Enter your total fixed costs, such as rent, salaries and software subscriptions.",
        "Enter the variable cost of producing or fulfilling one unit.",
        "Enter the price you sell each unit for.",
        "Click Calculate break-even to see units, revenue and contribution margin.",
        "Copy or download the summary to compare different pricing scenarios.",
      ],
      example:
        "A candle maker has $3,000 in monthly fixed costs, $8 of materials and labor per candle, and sells each for $25. The $17 contribution margin means they must sell about 177 whole candles per month (roughly $4,417 in revenue) to break even.",
      benefits: [
        "See the exact sales target needed to cover every cost.",
        "Understand how price changes move the break-even point.",
        "Whole-unit rounding gives a realistic, achievable target.",
        "Contribution margin figures support smarter pricing decisions.",
      ],
      faqs: [
        {
          q: "What is a fixed cost?",
          a: "A fixed cost does not change with the number of units you make or sell in the short term, such as rent, insurance or a monthly software plan. Variable costs, by contrast, rise with each extra unit.",
        },
        {
          q: "Why do break-even units round up?",
          a: "You cannot sell a fraction of a physical product. The exact result shows the mathematical point, while the whole-unit figure is the first integer sales count where total revenue meets or exceeds total cost.",
        },
        {
          q: "What if my price is below my variable cost?",
          a: "There is no break-even point. Every sale adds a loss, so selling more moves you further from profitability. The tool flags this instead of returning a meaningless negative result.",
        },
        {
          q: "Does this include taxes and one-off costs?",
          a: "Only if you include them in the figures you enter. Add ongoing tax obligations to fixed costs and per-unit charges to variable cost. One-off purchases can be added to fixed costs for the period you are analysing.",
        },
        {
          q: "Can I use this for a service business?",
          a: "Yes. Treat fixed costs as your overhead, variable cost per unit as the direct cost of delivering one billable hour or project, and price as what you charge for it.",
        },
      ],
    },
  },
  {
    slug: "marketplace-fee-calculator",
    title: "Marketplace Fee Calculator",
    description:
      "Work out net payout after marketplace charges. Enter your own referral, processing and fixed fees to see a clear breakdown and the true effective fee rate on each sale.",
    category: "e-commerce",
    keywords: [
      "marketplace fee calculator",
      "net payout calculator",
      "seller fee calculator",
      "referral fee calculator",
      "ecommerce fees",
      "selling fees breakdown",
    ],
    icon: "ShoppingBag",
    status: "ready",
    popularity: 77,
    addedAt: "2026-11-22",
    related: [
      "ecommerce-profit-calculator",
      "break-even-calculator",
      "vat-calculator",
      "profit-margin-calculator",
      "wholesale-price-calculator",
    ],
    content: {
      what: "The Marketplace Fee Calculator turns a sale price into a real net payout by subtracting every fee you specify. You add any number of named percentage fees, such as referral, payment processing or promotion charges, plus flat per-order costs. There are no built-in marketplace rates, so the numbers always reflect the fee schedule you actually pay. A full breakdown shows each deduction and the effective overall fee rate.",
      howTo: [
        "Enter the price the customer pays for the item.",
        "Name each fee your marketplace charges and enter its percentage.",
        "Add a fixed per-order fee if your platform charges one.",
        "Click Calculate payout to see the net amount and a line-by-line breakdown.",
        "Copy or download the breakdown for your accounting records.",
      ],
      example:
        "A $120 order with a 10% referral fee, a 3% payment fee and a $0.30 fixed charge loses $12.00, $3.60 and $0.30 respectively. Total fees are $15.90 (13.3% effective), leaving a net payout of $104.10.",
      benefits: [
        "No assumed rates: you control every fee percentage.",
        "Add or remove fee lines as your channel mix changes.",
        "See the effective fee rate, not just individual percentages.",
        "A downloadable breakdown simplifies bookkeeping and reconciliation.",
      ],
      faqs: [
        {
          q: "Does the tool know any marketplace's official rates?",
          a: "No, and that is deliberate. Marketplace schedules change and vary by category and country. You enter the rates from your own fee schedule, so the result always matches your situation rather than an outdated preset.",
        },
        {
          q: "Can I model more than two fees?",
          a: "Yes. Use Add fee to create as many percentage-based lines as you need, and give each a name so the breakdown is readable. Remove any line you no longer charge.",
        },
        {
          q: "What are fixed fees per sale?",
          a: "They are flat amounts charged per order regardless of value, such as a listing fee or a payment gateway per-transaction charge. Enter the total of any such charges in the fixed field.",
        },
        {
          q: "What if my fees add up to more than the sale price?",
          a: "The tool shows a negative net payout and a warning. That means the order loses money after fees, so you should raise the price, reduce chargeable services or reconsider that sales channel.",
        },
        {
          q: "Does this include shipping or sales tax?",
          a: "Only if you treat them as fees. Enter shipping costs you absorb as a fixed fee, and exclude tax you simply collect and remit, since that is not your revenue.",
        },
      ],
    },
  },
  {
    slug: "ecommerce-profit-calculator",
    title: "E-commerce Profit Calculator",
    description:
      "Calculate true profit and margin from revenue, cost of goods, shipping, advertising, platform fees and returns. See where your money goes and whether a store is really profitable.",
    category: "e-commerce",
    keywords: [
      "ecommerce profit calculator",
      "online store profit",
      "profit margin calculator ecommerce",
      "net profit calculator",
      "cost of goods calculator",
      "store profitability",
    ],
    icon: "Briefcase",
    status: "ready",
    popularity: 79,
    addedAt: "2026-11-22",
    related: [
      "break-even-calculator",
      "marketplace-fee-calculator",
      "profit-margin-calculator",
      "wholesale-price-calculator",
    ],
    content: {
      what: "The E-commerce Profit Calculator builds a simple profit statement for an online store. It takes total revenue and subtracts the six costs that most often erode online margins: cost of goods sold, shipping, advertising, platform and payment fees, and returns or refunds. The result shows net profit, profit margin, total costs and what share of revenue those costs consume, so you can judge whether growth is actually creating value.",
      howTo: [
        "Enter total sales revenue for the period you want to analyse.",
        "Add cost of goods sold, shipping and any advertising spend.",
        "Enter platform fees and the value of returns or refunds.",
        "Click Calculate profit to see net profit, margin and total costs.",
        "Copy or download the profit statement for your records.",
      ],
      example:
        "A store with $25,000 revenue spends $9,000 on goods, $1,500 on shipping, $3,000 on ads, $2,000 on fees and $500 on refunds. Total costs are $16,000, leaving $9,000 profit and a healthy 36% margin.",
      benefits: [
        "Reveals profit after all major operating costs, not just gross margin.",
        "Highlights whether advertising spend is sustainable.",
        "Shows cost ratio so you can track efficiency over time.",
        "Private and instant: no figures leave your device.",
      ],
      faqs: [
        {
          q: "What period should the figures cover?",
          a: "Use any consistent window, such as one month or one quarter. Accuracy depends on including all costs that belong to that window, so pull matching figures from your accounting or marketplace reports.",
        },
        {
          q: "Should I include my own salary?",
          a: "For a true economic profit, include a reasonable owner's salary as a cost. Many store owners leave it out and overstate how profitable the business really is.",
        },
        {
          q: "How is margin different from markup?",
          a: "Margin is profit as a percentage of revenue, while markup is profit as a percentage of cost. This tool reports margin because it is the standard way to compare business performance.",
        },
        {
          q: "What if I sell at a loss on some orders?",
          a: "Loss-making orders are already reflected in the totals. If your overall profit is negative, the tool warns you and the statement shows which cost lines are largest, helping you target fixes.",
        },
        {
          q: "Does it handle multiple sales channels?",
          a: "Yes, as long as you combine revenue and costs across all channels for the period. For channel-level detail, run the calculation separately for each channel.",
        },
      ],
    },
  },
  {
    slug: "wholesale-price-calculator",
    title: "Wholesale Price Calculator",
    description:
      "Turn a retail price into a wholesale price using keystone, retailer margin or markup. Compare the resulting wholesale rate, margin and markup in seconds with no spreadsheets.",
    category: "e-commerce",
    keywords: [
      "wholesale price calculator",
      "keystone pricing calculator",
      "retail to wholesale calculator",
      "wholesale pricing",
      "retailer margin calculator",
      "markup calculator",
    ],
    icon: "Tag",
    status: "ready",
    popularity: 76,
    addedAt: "2026-11-22",
    related: [
      "profit-margin-calculator",
      "break-even-calculator",
      "discount-calculator",
      "ecommerce-profit-calculator",
    ],
    content: {
      what: "The Wholesale Price Calculator works backwards from a target retail price to the price a retailer should pay you. It supports three common models: keystone pricing, where retail is double wholesale; a desired retailer margin, where you choose the share of retail the retailer keeps; and a markup on wholesale. It then reports the resulting wholesale price, the retailer's margin and markup, and the wholesale-to-retail ratio so both sides of the trade can be evaluated.",
      howTo: [
        "Enter the retail price you expect the product to sell for.",
        "Choose a pricing model: keystone, desired retailer margin or markup.",
        "If needed, enter the target percentage for that model.",
        "Click Calculate wholesale to see the suggested wholesale price.",
        "Copy or download the summary to share with retail partners.",
      ],
      example:
        "A product with a $60 retail price under keystone pricing has a $30 wholesale price. If a retailer instead requires a 45% margin, the wholesale price falls to $33.00, giving them exactly 45% of the retail price.",
      benefits: [
        "Test keystone and custom margin models side by side.",
        "Give retailers a clear, defensible wholesale quote.",
        "See margin and markup so neither is confused with the other.",
        "Fast, repeatable maths you can verify by hand.",
      ],
      faqs: [
        {
          q: "What is keystone pricing?",
          a: "Keystone is the traditional retail rule of setting the retail price at twice the wholesale cost. That gives the retailer a 50% gross margin and a 100% markup on cost. The tool applies it instantly when you select the keystone model.",
        },
        {
          q: "Which margin should I enter?",
          a: "Enter the gross margin the retailer needs to cover their operating costs and profit, expressed as a percentage of the retail price. A higher required margin produces a lower wholesale price for you.",
        },
        {
          q: "Margin and markup sound the same. Are they?",
          a: "No. Margin is a percentage of the selling price, while markup is a percentage of the cost you pay. A 50% margin equals a 100% markup. The calculator shows both to avoid costly confusion.",
        },
        {
          q: "Does this tell me my production cost?",
          a: "No. It only derives a wholesale price from a retail target. Compare that wholesale price with your own production and overhead costs to decide whether the margin works for you.",
        },
        {
          q: "Can I use it for consignment or dropshipping?",
          a: "The wholesale result is a useful starting point, but those models shift costs and risk differently. Adjust the inputs to reflect who pays for shipping, returns and storage before quoting a final rate.",
        },
      ],
    },
  },
  {
    slug: "product-sku-generator",
    title: "Product SKU Generator",
    description:
      "Create unique product SKUs in bulk with a custom prefix, category code and numbering pattern. Generate up to 100 codes, check them instantly and download a clean CSV file.",
    category: "e-commerce",
    keywords: [
      "SKU generator",
      "product SKU generator",
      "bulk SKU creator",
      "SKU code maker",
      "inventory SKU generator",
      "CSV SKU list",
    ],
    icon: "Hash",
    status: "ready",
    popularity: 75,
    addedAt: "2026-11-22",
    related: [
      "slug-generator",
      "uuid-generator",
      "password-generator",
      "break-even-calculator",
    ],
    content: {
      what: "The Product SKU Generator produces structured, readable stock keeping units for a catalogue. You define a prefix, a category code, a separator, an optional suffix, a starting number and how many codes you need. Codes are built from sequential numbers with zero padding, which guarantees uniqueness across the batch. You can generate up to 100 SKUs at once, preview them and download a CSV ready to import into a store or spreadsheet.",
      howTo: [
        "Enter a prefix and category code, such as ACME and TSHIRT.",
        "Choose a separator and an optional suffix for your pattern.",
        "Set the starting number, quantity (up to 100) and number padding.",
        "Click Generate SKUs to preview the list and confirm the count.",
        "Download the CSV to import the codes into your inventory system.",
      ],
      example:
        "A pattern with prefix ACME, category TSHIRT, separator '-', start 1, padding 4 and quantity 5 produces ACME-TSHIRT-0001 through ACME-TSHIRT-0005 as five distinct SKUs.",
      benefits: [
        "Consistent, professional codes across an entire catalogue.",
        "Sequential numbering guarantees no duplicates in a batch.",
        "Configurable pattern adapts to your existing naming scheme.",
        "One-click CSV export saves hours of manual spreadsheet work.",
      ],
      faqs: [
        {
          q: "How does the tool guarantee no duplicate SKUs?",
          a: "Codes are generated from a strictly increasing number sequence, and the tool also checks each finished code against a set of those already produced. If a pattern ever collided, generation would stop with an error instead of returning duplicates.",
        },
        {
          q: "Why is the quantity limited to 100?",
          a: "The limit keeps the on-screen preview fast and readable. For a larger catalogue, generate several consecutive batches by raising the start number each time, for example 1, 101, 201 and so on.",
        },
        {
          q: "What characters can I use in codes?",
          a: "Prefix, category and suffix are normalised to uppercase letters and digits, with other characters collapsed into hyphens. That keeps codes clean and safe for store imports. The separator can be any short string you like.",
        },
        {
          q: "What does number padding do?",
          a: "Padding sets how many digits the sequence uses. With padding of 4, the number 7 becomes 0007. Consistent padding keeps codes the same length and makes them sort correctly in spreadsheets.",
        },
        {
          q: "Can I use these SKUs with barcodes?",
          a: "SKUs are internal identifiers, not barcodes. They are ideal for your own catalogue and inventory, but a UPC or EAN barcode requires registration and a different numbering standard.",
        },
      ],
    },
  },
];
