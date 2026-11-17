import type { Tool } from "@/types/tool";

/**
 * Phase 3 tools: documents, student, business, SEO, social and
 * productivity utilities. All of them run in the browser.
 */
export const phase3Tools: Tool[] = [
  {
    slug: "pdf-merger",
    title: "PDF Merger",
    description:
      "Combine several PDF files into one document in your browser. Reorder files before merging and download a single PDF without uploading anything.",
    category: "pdf-documents",
    keywords: ["merge pdf", "combine pdf", "join pdf files", "pdf merger", "pdf combine online"],
    icon: "Combine",
    status: "ready",
    popularity: 76,
    addedAt: "2026-11-16",
    related: ["pdf-splitter", "image-compressor", "slug-generator"],
    content: {
      what: "The PDF Merger loads your PDF files into browser memory, copies their pages into a new document in the order you choose, and writes a single downloadable PDF. No copy of your files is sent to a server, so contracts, invoices, and personal documents stay on your device.",
      howTo: [
        "Choose two or more PDF files, each up to 20 MB.",
        "Use the up and down buttons to put the files in the order you want.",
        "Click Merge PDF and wait for the progress message.",
        "Download the combined document when it is ready.",
      ],
      example:
        "A student scans four pages of a signed form as separate PDFs, merges them in the correct order, and uploads one document to the school portal.",
      benefits: [
        "Private by design because files never leave the browser.",
        "Control the page order with simple move buttons.",
        "No watermarks, sign-up, or page-count limits imposed by this tool.",
        "Works with standard PDF files from scanners and office suites.",
      ],
      faqs: [
        {
          q: "Are my PDF files uploaded?",
          a: "No. The merger reads each file with the browser File API and builds the output locally using JavaScript. Nothing is transmitted.",
        },
        {
          q: "Can I merge password-protected PDFs?",
          a: "No. Encrypted documents must be unlocked first. The tool reports a clear error if a file cannot be read.",
        },
        {
          q: "Is there a page limit?",
          a: "There is no artificial page limit, but very large documents use your device's memory. Each input file is limited to 20 MB to keep the browser responsive.",
        },
        { q: "Does the output keep bookmarks and form fields?", a: "Only page content is copied. Interactive bookmarks, form fields, and annotations from the source files are not preserved." },
      ],
    },
  },
  {
    slug: "pdf-splitter",
    title: "PDF Splitter",
    description:
      "Extract selected pages from a PDF into a new file. Enter page ranges such as 1-3, 5, 8 and download the result privately from your browser.",
    category: "pdf-documents",
    keywords: ["split pdf", "extract pdf pages", "pdf page extractor", "separate pdf", "pdf ranges"],
    icon: "Scissors",
    status: "ready",
    popularity: 74,
    addedAt: "2026-11-16",
    related: ["pdf-merger", "image-compressor", "word-counter"],
    content: {
      what: "The PDF Splitter reads a PDF in your browser and copies only the pages you choose into a new document. You can select single pages, ranges, or a mix of both, which is useful for sharing just one chapter or invoice from a larger file.",
      howTo: [
        "Choose a PDF file up to 20 MB.",
        "Check how many pages it contains.",
        "Enter the pages you want, for example 1-3, 5, 9.",
        "Click Split PDF and download the extracted pages.",
      ],
      example:
        "A landlord receives a 30-page lease but only needs to send pages 4 to 6 to a contractor. Entering 4-6 creates a three-page PDF in seconds.",
      benefits: [
        "Send only the pages someone actually needs.",
        "Page ranges are validated before processing, with clear errors.",
        "No uploads and no stored copies of your document.",
        "Output preserves the original page content and dimensions.",
      ],
      faqs: [
        {
          q: "What page range formats work?",
          a: "Use comma-separated page numbers and ranges such as 1, 3-5, 9. Duplicates are removed automatically and pages are kept in ascending order.",
        },
        {
          q: "Does splitting change the page contents?",
          a: "No. Selected pages are copied directly into a new PDF. Text, images, and page size are preserved.",
        },
        {
          q: "Can I split an encrypted PDF?",
          a: "No. Remove the password protection first. The tool will show an error if the document cannot be opened.",
        },
        { q: "Can I reorder the extracted pages?", a: "Pages are kept in ascending order. To arrange them differently, split the ranges separately and merge the parts with the PDF Merger in the order you want." },
      ],
    },
  },
  {
    slug: "final-grade-calculator",
    title: "Final Grade Calculator",
    description:
      "Work out the grade you need on a final exam or remaining assignment to reach a target course percentage, using transparent weighted-grade math.",
    category: "student-education",
    keywords: [
      "final grade calculator",
      "grade needed calculator",
      "weighted grade calculator",
      "exam grade calculator",
      "what grade do i need",
    ],
    icon: "GraduationCap",
    status: "ready",
    popularity: 79,
    addedAt: "2026-11-17",
    related: ["gpa-calculator", "percentage-calculator", "days-between-dates"],
    content: {
      what: "The Final Grade Calculator answers a common student question: what do I need on the remaining work to finish with a target grade? Enter the weighted percentage you already have and the weight of the remaining assessment, then choose a target. The result includes the formula so you can verify it yourself.",
      howTo: [
        "Enter your current weighted course percentage, for example 82.",
        "Enter how much the final exam or remaining work is worth.",
        "Choose the course percentage you want to finish with.",
        "Read the required percentage and the formula used.",
      ],
      example:
        "You currently have 82% and the final exam is worth 30%. To finish with 85%, you need (85 − 0.7 × 82) ÷ 0.3 = 92% on the exam.",
      benefits: [
        "Plan study time around a concrete target.",
        "See the math instead of trusting a black-box answer.",
        "Understand how much a heavily weighted exam really matters.",
        "No account and no stored academic records.",
      ],
      faqs: [
        {
          q: "What does 'current grade' mean here?",
          a: "It is your weighted percentage for everything already graded, excluding the final assessment. If your only completed work is worth 70% of the course, enter the average for that 70%.",
        },
        {
          q: "What if the required grade is above 100%?",
          a: "That means your target is no longer reachable with the remaining weight alone. The tool says so clearly instead of giving an impossible number.",
        },
        {
          q: "Does it handle extra credit?",
          a: "No. Extra credit policies vary by school, so include any known bonus in your current grade before calculating.",
        },
        { q: "What if the remaining work has no weight?", a: "A zero-weight remainder cannot be divided. The tool asks for a weight greater than zero; enter a tiny value if your grade is already fixed." },
      ],
    },
  },
  {
    slug: "profit-margin-calculator",
    title: "Profit Margin Calculator",
    description:
      "Calculate selling price, profit, gross margin, and markup from a product cost. Compare margin and markup side by side for pricing decisions.",
    category: "business-finance",
    keywords: [
      "profit margin calculator",
      "markup calculator",
      "gross margin calculator",
      "selling price calculator",
      "pricing calculator",
    ],
    icon: "Calculator",
    status: "ready",
    popularity: 80,
    addedAt: "2026-11-17",
    related: ["percentage-calculator", "simple-interest-calculator", "gpa-calculator"],
    content: {
      what: "The Profit Margin Calculator turns a product cost and a desired margin into a recommended selling price. It also shows the opposite view: starting from a selling price, it calculates profit, gross margin percentage, and markup percentage. Margin and markup are different numbers, and this tool keeps them clearly separated.",
      howTo: [
        "Enter the cost of the product or service.",
        "Choose whether you want to start from a margin or a markup.",
        "Enter the target percentage and, if needed, a selling price.",
        "Read the selling price, profit, margin, and markup results.",
      ],
      example:
        "A product costs $40 and you want a 40% gross margin. The selling price is $40 ÷ (1 − 0.40) = $66.67, leaving $26.67 of profit.",
      benefits: [
        "Avoid confusing margin with markup when setting prices.",
        "Check wholesale and retail pricing in one place.",
        "See the formula behind every figure.",
        "Works on a phone while talking to a supplier.",
      ],
      faqs: [
        {
          q: "What is the difference between margin and markup?",
          a: "Margin is profit as a percentage of the selling price. Markup is profit as a percentage of the cost. A 50% markup produces a 33.3% margin.",
        },
        {
          q: "Does this include tax and shipping?",
          a: "No. Use the cost field for your landed cost including shipping, and treat sales tax separately because it depends on your jurisdiction.",
        },
        {
          q: "Can margin be more than 100%?",
          a: "Gross margin cannot exceed 100% because profit cannot exceed the selling price. Markup can easily exceed 100%.",
        },
        { q: "Can I compare two pricing scenarios side by side?", a: "Not in one view. Run the tool once per scenario and copy each summary to compare them." },
      ],
    },
  },
  {
    slug: "simple-interest-calculator",
    title: "Simple Interest Calculator",
    description:
      "Compute simple interest, final balance, principal, or time from the other values. See the formula and yearly breakdown for loans and savings.",
    category: "business-finance",
    keywords: [
      "simple interest calculator",
      "interest calculator",
      "loan interest calculator",
      "savings interest calculator",
      "principal interest rate time",
    ],
    icon: "Percent",
    status: "ready",
    popularity: 72,
    addedAt: "2026-11-17",
    related: ["profit-margin-calculator", "percentage-calculator", "days-between-dates"],
    content: {
      what: "The Simple Interest Calculator uses I = P × r × t for loans and savings that do not compound. You can find the interest earned, the final balance, or solve for an unknown principal, rate, or time. Results include the formula and a year-by-year summary.",
      howTo: [
        "Choose what you want to calculate: interest, balance, principal, rate, or time.",
        "Fill in the values you already know.",
        "Use years for time and a percentage for the annual rate.",
        "Read the result and the formula used.",
      ],
      example:
        "$1,000 saved for 3 years at 5% simple interest earns $1,000 × 0.05 × 3 = $150, for a final balance of $1,150.",
      benefits: [
        "Understand short-term loans and simple savings products.",
        "Solve for any variable, not just the interest amount.",
        "Formula is shown so the answer can be checked by hand.",
        "No personal or financial data is stored.",
      ],
      faqs: [
        {
          q: "Is this compound interest?",
          a: "No. Compound interest earns interest on previous interest and grows faster. This tool only handles simple interest, where each year earns the same amount.",
        },
        {
          q: "What time unit should I use?",
          a: "Time is entered in years. For six months, enter 0.5. For 18 months, enter 1.5.",
        },
        {
          q: "Can it calculate loan payments?",
          a: "No. An amortizing loan has regular payments and compounding effects, which need a different formula. This tool is for simple interest only.",
        },
        { q: "Can I enter a negative interest rate?", a: "No. Rates are limited to zero or more because negative interest is outside this tool's scope." },
      ],
    },
  },
  {
    slug: "slug-generator",
    title: "Slug Generator",
    description:
      "Turn any title into a clean URL slug with lowercase text, chosen separators, optional stop-word removal, and Unicode-aware transliteration.",
    category: "web-seo",
    keywords: ["slug generator", "url slug", "seo slug", "make slug", "friendly url generator"],
    icon: "Link2",
    status: "ready",
    popularity: 77,
    addedAt: "2026-11-16",
    related: ["keyword-density-checker", "url-encoder-decoder", "color-contrast-checker"],
    content: {
      what: "The Slug Generator converts a headline or page title into a short, readable URL path. It lowercases text, removes punctuation, replaces spaces with your chosen separator, and can strip common stop words to keep URLs short. Diacritics are folded to plain Latin letters where possible.",
      howTo: [
        "Type or paste a page title.",
        "Choose a separator: hyphen, underscore, or none.",
        "Toggle stop-word removal if you want a shorter slug.",
        "Copy the slug or download it as a text file.",
      ],
      example:
        "The title \"How to Compress Images for the Web\" becomes how-to-compress-images-for-the-web, with hyphens by default.",
      benefits: [
        "Readable URLs that both people and search engines understand.",
        "Consistent formatting across a whole site.",
        "Stop-word removal keeps overly long titles manageable.",
        "Instant results with no upload and no tracking.",
      ],
      faqs: [
        {
          q: "What happens to non-Latin characters?",
          a: "Latin letters with accents are folded to plain letters. Scripts such as Khmer are kept as Unicode characters when the browser can represent them in a URL. Slugs with such characters are usually percent-encoded by the browser automatically.",
        },
        {
          q: "Should I remove stop words from slugs?",
          a: "Usually only for very long titles. Short slugs that still describe the page are easiest to read and share.",
        },
        {
          q: "Does changing a slug break links?",
          a: "Yes. If a page is already published, keep its existing slug or set up a redirect. Generate slugs before publishing new pages.",
        },
        { q: "Can slugs contain uppercase letters?", a: "No. Slugs are lowercased by design because many servers treat URLs as case-sensitive." },
      ],
    },
  },
  {
    slug: "keyword-density-checker",
    title: "Keyword Density Checker",
    description:
      "Analyze repeated words and phrases in a piece of text. See word counts, percentages, and phrase frequencies to spot overused terms.",
    category: "web-seo",
    keywords: [
      "keyword density checker",
      "word frequency counter",
      "keyword analyzer",
      "text repetition checker",
      "seo keyword tool",
    ],
    icon: "BarChart3",
    status: "ready",
    popularity: 68,
    addedAt: "2026-11-16",
    related: ["slug-generator", "word-counter", "color-contrast-checker"],
    content: {
      what: "The Keyword Density Checker counts how often each word and two or three-word phrase appears in your text, then shows the share of total words as a percentage. It is a writing aid for spotting repetition, not a ranking tool — search engines do not use a simple density threshold.",
      howTo: [
        "Paste the text or draft you want to review.",
        "Choose whether to include common stop words.",
        "Read the top single words and phrases with their counts.",
        "Rewrite any terms that appear far more often than intended.",
      ],
      example:
        "A 300-word product description mentions \"durable\" 18 times, or 6% of all words. The report makes that repetition obvious so it can be trimmed.",
      benefits: [
        "Find unintentional repetition in drafts and product pages.",
        "See two-word and three-word phrases, not just single terms.",
        "Understand relative frequency instead of raw counts alone.",
        "Text is analyzed locally and never stored.",
      ],
      faqs: [
        {
          q: "Is there an ideal keyword density?",
          a: "No. Write for the reader and cover the topic naturally. This tool highlights patterns so you can decide whether a passage sounds repetitive.",
        },
        {
          q: "How are phrases counted?",
          a: "Phrases are counted across word boundaries, ignoring punctuation. A two-word phrase appearing three times is reported three times.",
        },
        {
          q: "Does it work with Khmer text?",
          a: "Single-word counting uses the browser's international segmenter where available. Word-boundary-based phrase counts are most reliable for languages that use spaces.",
        },
        { q: "Does it detect keyword stuffing?", a: "It highlights repetition only. Whether a term is overused depends on context and reader experience, which the tool cannot judge." },
      ],
    },
  },
  {
    slug: "color-contrast-checker",
    title: "Color Contrast Checker",
    description:
      "Check foreground and background colors against WCAG contrast ratios for normal text, large text, and UI components. Get a clear pass or fail.",
    category: "web-seo",
    keywords: [
      "color contrast checker",
      "wcag contrast ratio",
      "accessibility contrast checker",
      "text contrast calculator",
      "aa contrast checker",
    ],
    icon: "Palette",
    status: "ready",
    popularity: 73,
    addedAt: "2026-11-17",
    related: ["slug-generator", "keyword-density-checker", "image-resizer"],
    content: {
      what: "The Color Contrast Checker computes the WCAG 2.1 contrast ratio between two colors and compares it with the AA and AAA thresholds for normal text, large text, and non-text UI elements. It also offers a quick preview so you can judge readability before shipping a design.",
      howTo: [
        "Pick a foreground (text) color and a background color.",
        "Review the computed contrast ratio.",
        "Check the AA and AAA results for your text size.",
        "Adjust either color until the target level passes.",
      ],
      example:
        "Dark gray #1f2937 on white #ffffff gives a ratio above 12:1, which passes AAA for normal text. Light gray #9ca3af on white fails AA.",
      benefits: [
        "Catch unreadable color pairs before publishing.",
        "Understand the difference between AA and AAA targets.",
        "Preview real text on your chosen background.",
        "Calculation follows the published WCAG relative luminance formula.",
      ],
      faqs: [
        {
          q: "What ratios do I need?",
          a: "WCAG AA requires 4.5:1 for normal text and 3:1 for large text or UI components. AAA requires 7:1 for normal text and 4.5:1 for large text.",
        },
        {
          q: "What counts as large text?",
          a: "At least 18pt (24px) regular weight, or 14pt (18.66px) bold. Smaller text uses the stricter normal-text thresholds.",
        },
        {
          q: "Does a passing ratio guarantee accessibility?",
          a: "No. Contrast is one part of accessibility. Also check focus states, font size, semantics, and how the design behaves in dark mode.",
        },
        { q: "Does this test for color blindness?", a: "No. It computes relative luminance contrast only. Use a color-vision simulation tool as an additional accessibility check." },
      ],
    },
  },
  {
    slug: "social-caption-counter",
    title: "Social Caption Counter",
    description:
      "Check caption length against platform limits for X, Instagram, Facebook, and LinkedIn, with live character and word counts.",
    category: "social-media",
    keywords: [
      "social media character counter",
      "caption counter",
      "instagram caption length",
      "twitter character counter",
      "linkedin post counter",
    ],
    icon: "MessageSquare",
    status: "ready",
    popularity: 70,
    addedAt: "2026-11-16",
    related: ["word-counter", "qr-code-generator", "text-case-converter"],
    content: {
      what: "The Social Caption Counter measures your draft against commonly used character limits for several platforms. It counts characters, words, and lines, and shows how much room is left for each network. Limits are provided as a planning guide and can change when platforms update their rules.",
      howTo: [
        "Paste or type your caption into the editor.",
        "Look at the per-platform progress bars.",
        "Shorten or expand the text to fit the platform you are publishing on.",
        "Copy the final caption when it fits.",
      ],
      example:
        "A 210-character caption fits Instagram's 2,200-character limit easily but is too long for an X post, which has a 280-character limit.",
      benefits: [
        "One draft checked against several platforms.",
        "Immediate feedback while writing on mobile.",
        "Clear warning when a caption is over a limit.",
        "Nothing is posted or stored anywhere.",
      ],
      faqs: [
        {
          q: "Are these limits exact?",
          a: "They are planning values based on commonly published limits. Platforms can change them, and some count links or emoji differently. Always confirm in the publisher before posting.",
        },
        {
          q: "How are emoji counted?",
          a: "Characters are counted as Unicode code points, so most single emoji count as one. Complex emoji sequences may count as more, which matches how many platform counters behave.",
        },
        {
          q: "Does it include hashtags?",
          a: "Yes. Hashtags are part of the caption text and count toward the limit.",
        },
        { q: "Does a shortened link count as one character?", a: "No. The full URL length is counted. Some platforms shorten links automatically, so their composer may show a different count." },
      ],
    },
  },
  {
    slug: "days-between-dates",
    title: "Days Between Dates",
    description:
      "Count the exact number of days, weeks, months, and years between two dates, with options to include or exclude the end day.",
    category: "productivity",
    keywords: [
      "days between dates",
      "date difference calculator",
      "countdown days",
      "how many days until",
      "date duration calculator",
    ],
    icon: "CalendarRange",
    status: "ready",
    popularity: 75,
    addedAt: "2026-11-17",
    related: ["age-calculator", "final-grade-calculator", "simple-interest-calculator"],
    content: {
      what: "The Days Between Dates tool measures the span between a start and end date. It shows total days and weeks plus a calendar breakdown into years, months, and days, and it can count the end day inclusively when you need that convention.",
      howTo: [
        "Choose a start date and an end date.",
        "Decide whether to include the end day in the count.",
        "Read the total days, weeks, and calendar breakdown.",
        "Reverse the dates if you want to count backwards.",
      ],
      example:
        "From 1 January 2026 to 17 November 2026 there are 320 days, or 45 weeks and 5 days, without counting the end day twice.",
      benefits: [
        "Plan deadlines, trips, and project timelines.",
        "Handles leap years and different month lengths correctly.",
        "Inclusive mode for forms that count both endpoint days.",
        "No data leaves the page.",
      ],
      faqs: [
        {
          q: "Does it count weekends and holidays?",
          a: "It counts calendar days only. Working-day counts depend on local holidays and are not calculated here.",
        },
        {
          q: "What if the end date is earlier?",
          a: "The tool accepts it and reports a negative span, so you can see the direction of the difference at a glance.",
        },
        {
          q: "What does inclusive mean here?",
          a: "Inclusive mode adds one day so both the start and end dates are counted, which some forms and rental agreements require.",
        },
        { q: "Can it count business days?", a: "No. It counts calendar days only. Business-day counting needs a holiday calendar that varies by country." },
      ],
    },
  },
];
