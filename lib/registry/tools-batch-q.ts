import type { Tool } from "@/types/tool";

/** Batch Q: ten original client-side tools (51–60). */
export const batchQTools: Tool[] = [
  {
    slug: "unit-converter",
    title: "Unit Converter",
    description:
      "Convert length, weight, temperature, area, volume and time with exact factors. Swap units instantly and see clean results without uploading anything.",
    category: "productivity",
    keywords: ["unit converter", "length converter", "temperature converter", "weight converter", "metric conversion", "volume converter"],
    icon: "Calculator",
    status: "ready",
    popularity: 85,
    addedAt: "2026-11-22",
    related: ["percentage-calculator", "days-between-dates", "bmi-calculator", "savings-goal-calculator"],
    content: {
      what: "The Unit Converter translates values between units across six everyday categories: length, weight and mass, temperature, area, volume and time. Length, weight, area and volume use exact SI-derived conversion factors, while temperature uses the precise affine formulas between Celsius, Fahrenheit and Kelvin. Every calculation happens locally, so the tool works offline once the page has loaded and never records what you convert.",
      howTo: [
        "Choose a measurement type such as Length or Temperature.",
        "Type the numeric value you want to convert.",
        "Select the source unit and the target unit from the dropdowns.",
        "Read the converted value; use the swap button to reverse the direction instantly.",
      ],
      example:
        "Selecting Length, entering 1, choosing kilometers and targeting miles returns about 0.621371 mi. Switching to Temperature and converting 100 °C returns 212 °F.",
      benefits: [
        "Six categories cover the conversions people reach for most.",
        "Factors are exact constants, not rounded approximations.",
        "Temperature handles offsets correctly, unlike simple multiplication tools.",
        "Live results and a one-click swap make comparisons effortless.",
      ],
      faqs: [
        {
          q: "Are the conversion factors exact?",
          a: "Where an exact definition exists it is used: an inch is 0.0254 m, a pound is 0.45359237 kg and a mile is 1609.344 m. Averages such as months and years are labelled as such because their length varies.",
        },
        {
          q: "Why does my temperature result look different from another site?",
          a: "Temperature scales have different zero points, so the tool converts through Celsius with the correct offsets. Multiplying directly would be wrong. Kelvin results are absolute and include the 273.15 offset.",
        },
        {
          q: "Can I convert between categories, like meters to kilograms?",
          a: "No. Conversions are only meaningful within the same category. A length cannot be converted into a weight because they measure different physical quantities.",
        },
        {
          q: "Does the tool store my conversions?",
          a: "No. All math runs in your browser and nothing is saved or transmitted. The page can be used repeatedly without leaving a trace.",
        },
      ],
    },
  },
  {
    slug: "bmi-calculator",
    title: "BMI Calculator",
    description:
      "Calculate Body Mass Index in metric or imperial units, see your WHO-style category and a healthy weight range, with a clear non-medical disclaimer.",
    category: "productivity",
    keywords: ["BMI calculator", "body mass index", "healthy weight range", "metric imperial BMI", "BMI category"],
    icon: "Calculator",
    status: "ready",
    popularity: 82,
    addedAt: "2026-11-22",
    related: ["unit-converter", "age-calculator", "savings-goal-calculator"],
    content: {
      what: "The BMI Calculator computes Body Mass Index as weight divided by height squared, or 703 times weight in pounds divided by height in inches squared for imperial inputs. It then places the value into the standard underweight, healthy, overweight and obese ranges and estimates the weight span that corresponds to a healthy BMI at your height. It is a quick educational estimate, not a health assessment.",
      howTo: [
        "Pick the metric or imperial measurement system.",
        "Enter your weight in kilograms or pounds.",
        "Enter your height in meters, or feet and inches.",
        "Click Calculate BMI to see your value, category and indicative healthy weight range.",
      ],
      example:
        "A person weighing 70 kg with a height of 1.75 m gets a BMI of about 22.9, which falls in the healthy range, with a healthy weight span of roughly 56.7 to 76.3 kg.",
      benefits: [
        "Supports both metric and imperial inputs without manual conversion.",
        "Shows the familiar four BMI categories with their numeric ranges.",
        "Estimates a healthy weight band for your height.",
        "Displays a prominent disclaimer so results are never mistaken for medical advice.",
      ],
      faqs: [
        {
          q: "Is BMI an accurate measure of health?",
          a: "BMI is a population screening tool, not a diagnosis. It does not distinguish muscle from fat and ignores age, sex, bone density and ethnicity. Athletes and older adults in particular can be misclassified.",
        },
        {
          q: "What is the 703 factor in the imperial formula?",
          a: "It is a unit-conversion constant that reconciles pounds and inches with the metric definition of BMI. It makes the imperial result mathematically identical to the metric one.",
        },
        {
          q: "What BMI is considered healthy?",
          a: "The common adult reference range is 18.5 to 24.9. Below 18.5 is underweight, 25 to 29.9 is overweight and 30 or more is obese. Different organisations and populations may use slightly different cut-offs.",
        },
        {
          q: "Does the calculator store my measurements?",
          a: "No. The calculation runs entirely in your browser and the values are cleared when you reset or reload. Nothing is uploaded or shared.",
        },
      ],
    },
  },
  {
    slug: "lorem-ipsum-generator",
    title: "Lorem Ipsum Generator",
    description:
      "Generate placeholder paragraphs, sentences or words instantly with adjustable amounts and the classic opening text. Fully client-side, no server calls.",
    category: "ai-writing",
    keywords: ["lorem ipsum generator", "placeholder text", "dummy text generator", "filler text", "lipsum generator"],
    icon: "Type",
    status: "ready",
    popularity: 80,
    addedAt: "2026-11-22",
    related: ["word-counter", "readability-score", "text-case-converter", "sql-formatter"],
    content: {
      what: "The Lorem Ipsum Generator produces realistic-looking placeholder text for mockups, templates and layout testing. Choose paragraphs, sentences or individual words, set how many you need and optionally begin with the traditional Lorem ipsum passage. Everything is assembled in your browser from a built-in word bank, so there is no network request and no rate limit.",
      howTo: [
        "Choose whether you want paragraphs, sentences or words.",
        "Enter the number of units to generate.",
        "Optionally keep the classic Lorem ipsum opening for paragraphs or sentences.",
        "Click Generate text, then copy or download the result.",
      ],
      example:
        "Selecting 3 paragraphs produces three blocks of four to seven pseudo-Latin sentences each, separated by blank lines and starting with the classic Lorem ipsum opening when that option is enabled.",
      benefits: [
        "Fill layouts quickly without drafting real copy.",
        "Three output modes cover blocks, sentences and single words.",
        "Adjustable amounts with sensible safety limits.",
        "Works entirely offline and never sends text anywhere.",
      ],
      faqs: [
        {
          q: "Is the text real Latin?",
          a: "No. It is pseudo-Latin derived from classical-sounding word fragments. It is designed to have familiar word shapes and rhythm without carrying meaningful content that could distract a reviewer.",
        },
        {
          q: "Will I get the same text every time?",
          a: "No. Each generation uses random sentence lengths and word choices, so clicking the button again produces fresh text. Enable the classic opening if you want a consistent first sentence.",
        },
        {
          q: "Is there a limit on how much I can generate?",
          a: "Yes. The tool caps output at 100 paragraphs, 500 sentences or 2000 words per run to keep the page responsive. Generate multiple batches if you need more.",
        },
        {
          q: "Can I use this text on a live website?",
          a: "Placeholder text is intended for drafts and mockups. Replace it with real copy before publishing so visitors and search engines see meaningful content.",
        },
      ],
    },
  },
  {
    slug: "sql-formatter",
    title: "SQL Formatter",
    description:
      "Beautify messy SQL with safe token-based formatting, keyword casing and configurable indentation that preserves strings, comments and quoted names.",
    category: "developer",
    keywords: ["SQL formatter", "SQL beautifier", "format SQL query", "SQL indentation", "SQL keyword case"],
    icon: "Braces",
    status: "ready",
    popularity: 83,
    addedAt: "2026-11-22",
    related: ["json-formatter", "json-validator", "regex-tester", "hash-generator"],
    content: {
      what: "The SQL Formatter turns cramped or inconsistent queries into readable, indented statements. It scans the input character by character into tokens, so string literals, line and block comments, and quoted or bracketed identifiers are left untouched. Keywords can be uppercased, lowercased or preserved, clause keywords start new lines and parentheses control indentation.",
      howTo: [
        "Paste a SQL statement into the input area.",
        "Choose uppercase, lowercase or preserved keyword casing.",
        "Set the indentation width in spaces.",
        "Click Format SQL, then copy or download the formatted query.",
      ],
      example:
        "The single line select id, name from users where active = 1 and role = 'admin' order by name; becomes a multi-line statement with SELECT, FROM, WHERE, AND and ORDER BY each on their own line and the string literal unchanged.",
      benefits: [
        "Token-based parsing avoids corrupting strings or comments.",
        "Casing and indentation are configurable to match your style guide.",
        "Clause and operator line breaks make long queries reviewable.",
        "Runs locally so sensitive schema or query text never leaves the browser.",
      ],
      faqs: [
        {
          q: "Does this execute my SQL anywhere?",
          a: "No. The tool only reformats the text. It does not connect to a database, validate syntax against a schema or send the query over the network.",
        },
        {
          q: "Will it preserve my string literals and comments?",
          a: "Yes. The tokenizer recognises single-quoted strings with doubled quotes, line comments starting with --, block comments and quoted identifiers, and keeps their contents intact.",
        },
        {
          q: "Which SQL dialects are supported?",
          a: "The formatter is dialect-agnostic and handles common SQL across PostgreSQL, MySQL, SQL Server and SQLite. Exotic vendor-specific syntax may be formatted as generic tokens but is not altered in meaning.",
        },
        {
          q: "Why are commas placed at the end of a line?",
          a: "Breaking after top-level commas makes select lists and value lists easier to scan. Commas inside parentheses, such as function arguments, stay inline.",
        },
      ],
    },
  },
  {
    slug: "hash-generator",
    title: "Hash Generator",
    description:
      "Compute SHA-256 or SHA-1 hex digests from text or files using the browser's Web Crypto API. Private, fast and free of any uploads.",
    category: "security-privacy",
    keywords: ["hash generator", "SHA-256 generator", "SHA-1 hash", "file hash", "text hash online"],
    icon: "Fingerprint",
    status: "ready",
    popularity: 81,
    addedAt: "2026-11-22",
    related: ["password-generator", "uuid-generator", "base64-encoder-decoder", "jwt-decoder"],
    content: {
      what: "The Hash Generator produces cryptographic digests using the Web Crypto API built into modern browsers. Enter text or choose a file, pick SHA-256 or SHA-1, and receive a lowercase hexadecimal hash. Files are read as raw bytes with the File API, so a hash reflects the exact file content rather than its name. Nothing is uploaded and no data is retained.",
      howTo: [
        "Choose whether to hash text or a file.",
        "Enter the text or select a file from your device.",
        "Pick SHA-256 for general use or SHA-1 for legacy compatibility.",
        "Click Generate hash and copy or download the hexadecimal digest.",
      ],
      example:
        "Hashing the text hello with SHA-256 yields 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824, while a downloaded file gets a hash of its raw bytes.",
      benefits: [
        "Uses the native, well-tested Web Crypto implementation.",
        "Hashes text and arbitrary files with the same interface.",
        "Offers SHA-1 for legacy systems alongside SHA-256.",
        "Entirely local, making it safe for sensitive inputs.",
      ],
      faqs: [
        {
          q: "What is a hash used for?",
          a: "A hash is a fixed-size fingerprint of data. Identical input always gives identical output, so hashes are used to verify file integrity, detect duplicates and support digital signatures. They are one-way and cannot be reversed to recover the original data.",
        },
        {
          q: "Should I use SHA-1 or SHA-256?",
          a: "Prefer SHA-256 for anything security-related. SHA-1 is included only because some older systems still require it; it is considered cryptographically broken for collision resistance and should not be used for new security designs.",
        },
        {
          q: "Does hashing a file change it?",
          a: "No. The file is read in place as read-only bytes. Nothing is modified, renamed or uploaded, and the page keeps no copy of the content.",
        },
        {
          q: "Why do I get a Web Crypto error?",
          a: "Web Crypto is available only in secure contexts. Open the site over HTTPS or on localhost and use a current browser. Very old browsers may also lack the required API.",
        },
      ],
    },
  },
  {
    slug: "invoice-generator",
    title: "Invoice Generator",
    description:
      "Create a professional invoice in the browser with line items, tax, discounts and notes, then print to PDF or download a plain-text copy instantly.",
    category: "business-finance",
    keywords: ["invoice generator", "free invoice maker", "invoice template", "line item invoice", "print invoice"],
    icon: "FileText",
    status: "ready",
    popularity: 84,
    addedAt: "2026-11-22",
    related: ["vat-calculator", "discount-calculator", "profit-margin-calculator", "freelance-rate-calculator"],
    content: {
      what: "The Invoice Generator builds a clean, printable invoice from details you enter on a simple form. Add as many line items as you like, set quantities and unit prices, apply a tax rate and a fixed discount, and the subtotal, tax and grand total update live. A formatted preview sits beside the form, and you can print or save it as a PDF with your browser or download a plain-text version.",
      howTo: [
        "Fill in your business details, client details and invoice dates.",
        "Add line items with a description, quantity and unit price.",
        "Set a tax rate, an optional discount and any notes.",
        "Review the live preview, then print to PDF or download the .txt file.",
      ],
      example:
        "Two items of 10 × $50 and 5 × $20 give a $600 subtotal. A 10% tax adds $60 for a $660 total, which appears immediately in the preview and printed invoice.",
      benefits: [
        "No account, signup or monthly fee required.",
        "Line items, tax and discounts are calculated automatically.",
        "Live preview shows exactly what clients will receive.",
        "Print to PDF or export text without sending data to a server.",
      ],
      faqs: [
        {
          q: "How do I save the invoice as a PDF?",
          a: "Click Print / Save PDF and choose Save as PDF in your browser's print dialog. The print styles hide the form and show only the invoice preview for a clean result.",
        },
        {
          q: "Are my invoice details stored anywhere?",
          a: "No. The invoice lives only in the current page. Reloading or closing the tab clears it, so remember to download or print a copy before you leave.",
        },
        {
          q: "Can I use currencies other than USD?",
          a: "Yes. Edit the currency field with any three-letter ISO code such as EUR or GBP, and amounts will be formatted accordingly using your browser's locale rules.",
        },
        {
          q: "Does it calculate VAT or sales tax automatically?",
          a: "You enter the applicable tax rate and the tool applies it to the discounted subtotal. For complex multi-rate invoices, calculate each rate separately or use a dedicated VAT calculator first.",
        },
      ],
    },
  },
  {
    slug: "freelance-rate-calculator",
    title: "Freelance Rate Calculator",
    description:
      "Turn a target salary, real billable hours and business expenses into a sustainable hourly and day rate for freelance or contract work.",
    category: "business-finance",
    keywords: ["freelance rate calculator", "hourly rate calculator", "day rate calculator", "freelance pricing", "contractor rate"],
    icon: "Briefcase",
    status: "ready",
    popularity: 78,
    addedAt: "2026-11-22",
    related: ["invoice-generator", "profit-margin-calculator", "savings-goal-calculator", "loan-calculator"],
    content: {
      what: "The Freelance Rate Calculator works backwards from the income you want to live on. It adds your annual business expenses and an optional tax buffer, then divides the required revenue by the hours you can realistically bill after holidays and sick days. The result is a minimum hourly rate and a matching day rate, plus the annual and monthly revenue you need to hit your target.",
      howTo: [
        "Enter your target take-home salary and yearly business expenses.",
        "Set how many hours per week you can actually bill to clients.",
        "Adjust weeks worked, weeks off, hours per day and a tax buffer.",
        "Click Calculate rate to see your hourly floor, day rate and revenue targets.",
      ],
      example:
        "A $60,000 salary, $6,000 expenses, 20% tax buffer and 1,200 billable hours a year produce roughly $66 per hour and a $528 day rate at eight hours per day.",
      benefits: [
        "Prices based on billable hours, not a 40-hour salaried week.",
        "Includes expenses and a tax buffer so you do not undercharge.",
        "Shows monthly and annual revenue targets for planning.",
        "Runs locally with no signup or personal financial data stored.",
      ],
      faqs: [
        {
          q: "Why is my rate higher than my old salary divided by hours?",
          a: "As a freelancer you must cover unpaid time, expenses, equipment and tax from the same revenue. Billing only the hours a salaried employee would work ignores those costs and leads to undercharging.",
        },
        {
          q: "What should I enter for billable hours?",
          a: "Use a realistic weekly estimate of hours spent on paid client work, not total hours worked. Admin, marketing and invoicing are usually non-billable and belong in your expenses or buffer.",
        },
        {
          q: "Is this a tax calculation?",
          a: "No. The tax buffer is a simple percentage you choose as a cushion. Actual tax depends on your jurisdiction, deductions and business structure, so consult an accountant for accurate figures.",
        },
        {
          q: "Should I charge the exact rate shown?",
          a: "Treat it as a floor. Market demand, positioning and the value you deliver may justify charging more, but going below it risks not covering your costs.",
        },
      ],
    },
  },
  {
    slug: "savings-goal-calculator",
    title: "Savings Goal Calculator",
    description:
      "Find out how long it will take to reach a savings goal from your current balance, monthly contribution and expected annual return.",
    category: "business-finance",
    keywords: ["savings goal calculator", "how long to save", "monthly savings calculator", "goal timeline calculator", "savings planner"],
    icon: "TrendingUp",
    status: "ready",
    popularity: 77,
    addedAt: "2026-11-22",
    related: ["compound-interest-calculator", "simple-interest-calculator", "freelance-rate-calculator", "loan-calculator"],
    content: {
      what: "The Savings Goal Calculator projects how many months it will take to reach a target based on what you have now, what you add each month and an optional annual return. It simulates each month, applying interest to the balance before adding your deposit, and reports the time required, the amount you contributed and the interest earned. If your contributions and return cannot reach the goal, it says so clearly.",
      howTo: [
        "Enter the amount you want to save and your current balance.",
        "Add how much you can contribute each month.",
        "Optionally enter an expected annual return percentage.",
        "Click Calculate timeline to see the time to goal and contribution breakdown.",
      ],
      example:
        "Starting with $1,000 and adding $300 a month with no interest reaches a $10,000 goal in 30 months, with $9,000 coming from contributions and $1,000 from the starting balance.",
      benefits: [
        "Gives a concrete date-style timeline instead of a vague target.",
        "Shows how much of the goal comes from interest versus deposits.",
        "Handles a zero return for simple no-interest planning.",
        "Warns you when a goal is not reachable with the current plan.",
      ],
      faqs: [
        {
          q: "How does the return affect the timeline?",
          a: "A higher expected annual return compounds on the growing balance, shortening the timeline. Because it is applied monthly, the model assumes a constant rate and end-of-month deposits.",
        },
        {
          q: "What if my goal is not reachable?",
          a: "The tool reports that the goal is not reachable when monthly contributions are zero and there is no positive return to grow the balance. Increase deposits or lower the target to make progress.",
        },
        {
          q: "Are the return assumptions guaranteed?",
          a: "No. The projection is illustrative. Real savings and investments face variable returns, fees, taxes and inflation, none of which are modelled here.",
        },
        {
          q: "Does inflation change the result?",
          a: "The calculator works in today's money and does not adjust for inflation. A goal further in the future may cost more in real terms, so consider building in a cushion.",
        },
      ],
    },
  },
  {
    slug: "image-rotator",
    title: "Image Rotator",
    description:
      "Rotate JPEG, PNG or WebP photos by 90, 180 or 270 degrees with canvas and download the result as a PNG, all inside your browser.",
    category: "image-design",
    keywords: ["image rotator", "rotate image 90 degrees", "rotate photo online", "turn image sideways", "canvas image rotation"],
    icon: "Image",
    status: "ready",
    popularity: 79,
    addedAt: "2026-11-22",
    related: ["image-cropper", "image-resizer", "image-format-converter", "favicon-generator"],
    content: {
      what: "The Image Rotator turns a photo by a quarter turn, half turn or three-quarter turn using the Canvas API. Selecting 90 or 270 degrees swaps the output width and height automatically, and the rotated image is encoded as a PNG to preserve quality. A preview shows the exact result before you download, and the original file never leaves your device.",
      howTo: [
        "Choose a JPEG, PNG or WebP image from your device.",
        "Select 90, 180 or 270 degrees of clockwise rotation.",
        "Click Rotate image and check the preview and output dimensions.",
        "Download the rotated PNG when it looks right.",
      ],
      example:
        "A landscape photo that is 1600 × 900 pixels rotated 90 degrees becomes a 900 × 1600 portrait PNG, ready to download with its EXIF-free clean canvas output.",
      benefits: [
        "Fix sideways photos without installing an editor.",
        "Correct output dimensions for quarter turns automatically.",
        "PNG output avoids extra lossy compression on the rotated image.",
        "Private by design: nothing is uploaded to a server.",
      ],
      faqs: [
        {
          q: "Which image formats can I rotate?",
          a: "JPEG, PNG and WebP files up to 20 MB are accepted, subject to your browser's decoding support. The downloaded result is always a PNG.",
        },
        {
          q: "Why is the output a PNG instead of the original format?",
          a: "Re-encoding to PNG after rotation avoids introducing a second round of lossy compression. If you need JPEG or WebP, run the result through the Image Format Converter afterward.",
        },
        {
          q: "Does rotation keep the original resolution?",
          a: "Yes. No scaling is performed. A quarter turn swaps the width and height values while keeping every pixel, and a half turn keeps the dimensions unchanged.",
        },
        {
          q: "Does it preserve EXIF metadata and camera orientation?",
          a: "No. Canvas re-encoding strips metadata, including EXIF orientation tags. The visible pixels are rotated correctly, which is usually what you want, but location and camera data are removed.",
        },
      ],
    },
  },
  {
    slug: "favicon-generator",
    title: "Favicon Generator",
    description:
      "Turn an emoji or image into favicon PNGs at multiple sizes plus an ICO file, with live previews and downloads, entirely in your browser.",
    category: "image-design",
    keywords: ["favicon generator", "make favicon", "emoji favicon", "PNG ICO favicon", "website icon maker"],
    icon: "ImageDown",
    status: "ready",
    popularity: 76,
    addedAt: "2026-11-22",
    related: ["image-rotator", "image-resizer", "image-compressor", "open-graph-generator"],
    content: {
      what: "The Favicon Generator creates the small icons browsers show in tabs and bookmarks. Supply an emoji with a background colour or upload an image, and the tool renders square PNG icons at 16, 32, 48, 64 and 180 pixels and packs 16, 32 and 48 pixel images into a single ICO file. Previews and downloads are provided for every size, and all drawing happens on a local canvas.",
      howTo: [
        "Choose Emoji or Image as the source.",
        "Enter an emoji and background colour, or upload a square image.",
        "Click Generate favicons and review the previews.",
        "Download the individual PNG sizes and the favicon.ico file.",
      ],
      example:
        "Entering a rocket emoji on an indigo background produces favicon-16x16.png through favicon-180x180.png plus an ICO that combines 16, 32 and 48 pixel versions of the same icon.",
      benefits: [
        "Covers the PNG sizes browsers and Apple touch icons expect.",
        "Includes a real ICO container, not just renamed PNG files.",
        "Emoji and image sources both work without design software.",
        "Everything renders locally, so logos and artwork stay private.",
      ],
      faqs: [
        {
          q: "What sizes are generated?",
          a: "PNG files are produced at 16, 32, 48, 64 and 180 pixels square. The ICO file bundles the 16, 32 and 48 pixel PNG images using the modern PNG-in-ICO format supported by current browsers.",
        },
        {
          q: "Why does my emoji look different in the preview?",
          a: "Emoji glyphs come from your device's emoji font, so appearance varies between Windows, macOS and Linux. For consistent branding across platforms, upload a custom image instead.",
        },
        {
          q: "Does the tool upload my logo?",
          a: "No. Images are read locally, drawn to a canvas and encoded in the browser. No file data is transmitted or stored.",
        },
        {
          q: "How do I use the files on my site?",
          a: "Save favicon.ico in your site root and add an icon link in your HTML head. You can also reference the 180 pixel PNG as an Apple touch icon for iOS home screens.",
        },
      ],
    },
  },
];
