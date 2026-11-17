import type { Tool } from "@/types/tool";

/** Stage 3, Round 5 tools. */
export const stage3Round5Tools: Tool[] = [
  {
    slug: "loan-calculator",
    title: "Loan Calculator",
    description:
      "Estimate monthly payments, total interest and total repayment for an amortized loan. Enter an amount, annual rate and term to see the full picture.",
    category: "business-finance",
    keywords: ["loan calculator", "monthly payment calculator", "amortization calculator", "car loan calculator", "personal loan calculator"],
    icon: "Landmark",
    status: "ready",
    popularity: 89,
    addedAt: "2026-11-19",
    related: ["compound-interest-calculator", "simple-interest-calculator", "vat-calculator"],
    content: {
      what: "The Loan Calculator estimates the fixed monthly payment for a fully amortized loan using the standard annuity formula. It also reports the number of payments, total interest, and total amount repaid. All math runs in your browser and no loan details are stored.",
      howTo: [
        "Enter the amount you plan to borrow.",
        "Enter the annual interest rate and the term in years.",
        "Click Calculate loan to see the monthly payment and totals.",
        "Copy or download the summary for comparison with lender offers.",
      ],
      example:
        "A $10,000 loan at 6% annual interest over 1 year has 12 payments of about $860.66, with roughly $327.97 of total interest.",
      benefits: [
        "Compare offers with different rates and terms quickly.",
        "See the true interest cost, not just the monthly payment.",
        "Formula-based result you can verify independently.",
        "Private: no financial details leave your device.",
      ],
      faqs: [
        {
          q: "Does this include fees and insurance?",
          a: "No. It models principal and interest only. Add lender fees, insurance, and taxes separately to compare the real cost of a loan.",
        },
        {
          q: "What if the rate is 0%?",
          a: "The payment is simply the principal divided by the number of months, and total interest is zero. The tool handles this case.",
        },
        {
          q: "Are payments always the same?",
          a: "For a fixed-rate amortized loan, yes. Variable-rate loans and repayment holidays change the schedule, so this estimate may differ from your statements.",
        },
        {
          q: "Does it account for extra payments?",
          a: "No. Extra payments reduce interest and shorten the term. You would need an amortization schedule tool to model them.",
        },
      ],
    },
  },
  {
    slug: "compound-interest-calculator",
    title: "Compound Interest Calculator",
    description:
      "See how savings grow with compound interest. Choose annual, monthly or daily compounding and compare the final amount with the interest earned.",
    category: "business-finance",
    keywords: ["compound interest calculator", "savings growth calculator", "interest compounding", "investment calculator", "future value calculator"],
    icon: "TrendingUp",
    status: "ready",
    popularity: 90,
    addedAt: "2026-11-19",
    related: ["simple-interest-calculator", "loan-calculator", "percentage-calculator"],
    content: {
      what: "The Compound Interest Calculator applies A = P(1 + r/n)^(nt), where interest earns further interest over time. You choose the starting amount, annual rate, number of years, and how often interest is compounded. The result shows the final balance and the portion that came from interest.",
      howTo: [
        "Enter a starting amount and an assumed annual rate.",
        "Choose the number of years and compounding frequency.",
        "Click Calculate growth to see the final amount.",
        "Use the copyable summary to compare different scenarios.",
      ],
      example:
        "$1,000 at 7% compounded monthly for 10 years grows to about $2,009.66, of which roughly $1,009.66 is interest.",
      benefits: [
        "Understand the effect of compounding frequency.",
        "Plan savings goals with repeatable, transparent math.",
        "Compare scenarios without spreadsheets or accounts.",
        "No personal or financial information is uploaded.",
      ],
      faqs: [
        {
          q: "How is this different from simple interest?",
          a: "Simple interest pays the same amount every year on the original principal. Compound interest also earns interest on previous interest, which grows faster over longer terms.",
        },
        {
          q: "Does more frequent compounding always help?",
          a: "Yes, for the same nominal annual rate: daily beats monthly, which beats annually. The difference is small at low rates and short terms.",
        },
        {
          q: "Does it model regular deposits?",
          a: "No. This tool assumes a single starting amount with no further contributions. Add contributions in a dedicated savings calculator when you need them.",
        },
        {
          q: "Are returns guaranteed?",
          a: "No. The tool is illustrative. Real investments carry risk, fees, taxes, and variable returns that are not modeled here.",
        },
      ],
    },
  },
  {
    slug: "tip-split-calculator",
    title: "Tip / Split Bill Calculator",
    description:
      "Split a restaurant bill with a tip in seconds. Choose a preset or custom tip percentage, set the number of people and see exactly what each pays.",
    category: "productivity",
    keywords: ["tip calculator", "split bill calculator", "restaurant bill splitter", "tip split", "per person calculator"],
    icon: "Users",
    status: "ready",
    popularity: 86,
    addedAt: "2026-11-19",
    related: ["discount-calculator", "vat-calculator", "percentage-calculator"],
    content: {
      what: "The Tip / Split Bill Calculator takes a pre-tip subtotal, a tip percentage and the number of people. It returns the tip amount, the total bill, and the exact share per person. Preset buttons cover common tip levels while a custom field handles anything else. All arithmetic happens locally.",
      howTo: [
        "Enter the bill subtotal before tip.",
        "Pick a preset tip or enter a custom percentage.",
        "Enter how many people are splitting the bill.",
        "Click Calculate split and check the per-person amount.",
      ],
      example:
        "An $84.50 bill with a 15% tip adds $12.68, for a total of $97.18. Split between two people, each pays $48.59.",
      benefits: [
        "Avoid awkward rounding at the end of a meal.",
        "Presets for 10%, 15%, 18% and 20% tips.",
        "Works for any group size from one to one hundred.",
        "Nothing is uploaded or remembered after you leave.",
      ],
      faqs: [
        {
          q: "Can I split unevenly?",
          a: "No. This tool divides the total equally. For unequal shares, calculate each person's portion separately and add them up yourself.",
        },
        {
          q: "Is the tip based on the pre-tax amount?",
          a: "The tool applies the tip to whatever subtotal you enter. In some places tax is included in the bill, so enter the amount you want the percentage applied to.",
        },
        {
          q: "How are cents handled?",
          a: "The per-person value uses full precision and is rounded only for display. In practice, people may pay slightly different rounded amounts so the total adds up.",
        },
        {
          q: "Does it include a service charge?",
          a: "No. If the restaurant already added a service charge, include it in the subtotal or reduce your tip percentage accordingly.",
        },
      ],
    },
  },
];
