import type { Tool } from "@/types/tool";
import { phase3Tools } from "./tools-phase3";
import { phase4Tools } from "./tools-phase4";

export const tools: Tool[] = [
  ...phase3Tools,
  ...phase4Tools,
  {
    slug: "image-compressor",
    title: "Image Compressor",
    description:
      "Compress JPG, PNG, and WebP images in your browser without uploading them. Reduce file size, preview the quality, and download a web-ready image.",
    category: "image-design",
    keywords: [
      "image compressor",
      "compress jpg",
      "compress png",
      "reduce image size",
      "webp compressor",
      "optimize images",
    ],
    icon: "ImageDown",
    status: "ready",
    popularity: 98,
    addedAt: "2026-11-01",
    related: ["image-resizer", "qr-code-generator", "base64-encoder-decoder"],
    content: {
      what: "The Image Compressor reduces the file size of JPG, PNG, and WebP images by re-encoding them at a quality level you choose. Everything happens inside your browser with the Canvas API, so your images never leave your device. You can compare the original and compressed sizes before downloading.",
      howTo: [
        "Choose a JPG, PNG, or WebP image up to 20 MB.",
        "Pick an output format and adjust the quality slider.",
        "Click Compress and wait for the preview to appear.",
        "Compare the original and compressed sizes, then download the result.",
      ],
      example:
        "A blogger uploads a 4.2 MB photo taken on a phone. After compressing it to WebP at 78% quality, the file is around 420 KB and still looks sharp in the article.",
      benefits: [
        "Faster page loads and better Core Web Vitals scores.",
        "Lower storage and bandwidth costs for your website.",
        "Private by design because files are processed locally.",
        "No watermarks, sign-up, or daily limits.",
      ],
      faqs: [
        {
          q: "Are my images uploaded to a server?",
          a: "No. The compressor reads the file in your browser and writes the output there too. Nothing is transmitted.",
        },
        {
          q: "Why does PNG compression not reduce quality?",
          a: "PNG quality is controlled by colors, not a quality slider. For much smaller files, export to WebP or JPEG. The tool shows the estimated size before you download.",
        },
        {
          q: "Does compression change the image dimensions?",
          a: "No, the pixel width and height stay the same. Use the Image Resizer when you need different dimensions.",
        },
      ],
    },
  },
  {
    slug: "image-resizer",
    title: "Image Resizer",
    description:
      "Resize images to exact pixel dimensions or a percentage in your browser. Keep the aspect ratio, choose an output format, and download a clean result.",
    category: "image-design",
    keywords: [
      "image resizer",
      "resize image",
      "change image dimensions",
      "scale image",
      "social media image sizes",
      "resize photo online",
    ],
    icon: "Scaling",
    status: "ready",
    popularity: 95,
    addedAt: "2026-11-02",
    related: ["image-compressor", "qr-code-generator", "markdown-editor"],
    content: {
      what: "The Image Resizer changes the width and height of an image using a high-quality canvas draw. You can enter exact pixels or work by percentage, and optionally lock the aspect ratio so faces and objects do not stretch. The resized image is generated locally and downloaded directly.",
      howTo: [
        "Upload a JPG, PNG, or WebP image.",
        "Enter a target width, height, or percentage.",
        "Keep the aspect ratio locked unless you need a specific crop-like shape.",
        "Choose the output format and download the resized file.",
      ],
      example:
        "A seller needs a 1200 × 628 px image for a social preview. They enter 1200 in the width field with the ratio locked, and the height fills in automatically at 628.",
      benefits: [
        "Prepare images for social posts, thumbnails, and email.",
        "Avoid stretched or squashed photos with ratio locking.",
        "No software installation and no uploads.",
        "Works on phones, tablets, and desktops.",
      ],
      faqs: [
        {
          q: "Will resizing reduce quality?",
          a: "Enlarging an image always softens detail because new pixels must be invented. Reducing size usually looks crisp. Export as PNG for graphics and WebP or JPEG for photos.",
        },
        {
          q: "Can I resize without keeping the aspect ratio?",
          a: "Yes. Unlock the ratio and type any width and height. The image will stretch to those exact dimensions.",
        },
        {
          q: "What is the maximum image size?",
          a: "Uploads are limited to 20 MB. Very large pixel dimensions may also exceed your device's canvas limits, so the tool reports a clear error instead of failing silently.",
        },
      ],
    },
  },
  {
    slug: "qr-code-generator",
    title: "QR Code Generator",
    description:
      "Create a crisp QR code for a link, text, Wi-Fi note, or contact detail. Customize colors and size, then download a PNG that works in print and on screen.",
    category: "social-media",
    keywords: [
      "qr code generator",
      "create qr code",
      "qr code for url",
      "free qr code",
      "qr code png",
      "marketing qr code",
    ],
    icon: "QrCode",
    status: "ready",
    popularity: 94,
    addedAt: "2026-11-03",
    related: ["url-encoder-decoder", "image-resizer", "uuid-generator"],
    content: {
      what: "The QR Code Generator turns text or a URL into a scannable QR image. Codes are rendered in your browser, so the content is never sent to a QR service. You can adjust the foreground and background colors, choose a size, set the error-correction level, and download a PNG.",
      howTo: [
        "Type or paste the URL or text you want to encode.",
        "Choose a size and, if needed, error-correction level.",
        "Adjust the foreground and background colors for contrast.",
        "Scan the preview with your phone, then download the PNG.",
      ],
      example:
        "A small cafe creates a QR code for its menu link, prints it on table cards, and updates the menu page later without reprinting the card.",
      benefits: [
        "No account, watermark, or expiry on downloaded codes.",
        "High-contrast colors keep codes easy to scan.",
        "Works for links, plain text, phone numbers, and short notes.",
        "Generated privately in your browser.",
      ],
      faqs: [
        {
          q: "Do the QR codes expire?",
          a: "No. The code contains your content directly, so it keeps working as long as the destination URL exists. There is no redirect service involved.",
        },
        {
          q: "Why is my QR code not scanning?",
          a: "Usually the contrast is too low or the code is too small. Use dark foreground and light background colors, and keep the PNG at least 256 pixels wide.",
        },
        {
          q: "Can I use the code in print?",
          a: "Yes. PNG output works in most print layouts. For very large banners, generate a larger size so the modules stay sharp.",
        },
      ],
    },
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description:
      "Format messy JSON with clean indentation, minify it for production, and catch syntax errors with a clear message. Runs entirely in your browser.",
    category: "developer",
    keywords: [
      "json formatter",
      "json beautifier",
      "json minifier",
      "format json online",
      "validate json",
      "pretty print json",
    ],
    icon: "Braces",
    status: "ready",
    popularity: 96,
    addedAt: "2026-11-04",
    related: ["json-validator", "base64-encoder-decoder", "url-encoder-decoder"],
    content: {
      what: "The JSON Formatter parses your JSON and prints it with consistent indentation so nested objects and arrays are easy to read. It can also minify JSON into a compact single line for payloads. Invalid input produces an error with the position of the problem instead of a blank screen.",
      howTo: [
        "Paste JSON into the input box.",
        "Choose 2 spaces, 4 spaces, or tab indentation.",
        "Click Format for readable output or Minify for a compact version.",
        "Copy the result or download it as a .json file.",
      ],
      example:
        "An API returns one long line of JSON. Pasting it into the formatter and choosing 2 spaces turns it into a readable tree you can inspect in seconds.",
      benefits: [
        "Spot missing commas and brackets quickly.",
        "Share readable payloads with teammates.",
        "Minify before sending JSON from a script.",
        "Sensitive data never leaves the browser.",
      ],
      faqs: [
        {
          q: "Does the formatter change my data?",
          a: "No. It parses the JSON and re-serializes it with different whitespace. Keys, values, and array order stay the same.",
        },
        {
          q: "Can I format very large JSON files?",
          a: "The tool handles typical payloads well, but extremely large files can be slow because everything happens in your browser. It shows an error if the input is too large to process comfortably.",
        },
        {
          q: "Why does my JSON fail to parse?",
          a: "The common causes are trailing commas, single quotes, unquoted keys, and comments. Standard JSON does not allow them. The error message points to the position to check.",
        },
      ],
    },
  },
  {
    slug: "json-validator",
    title: "JSON Validator",
    description:
      "Validate JSON instantly and see exactly where a syntax error is. Get useful stats like object count, depth, and size when the JSON is valid.",
    category: "developer",
    keywords: [
      "json validator",
      "validate json",
      "json syntax checker",
      "json error finder",
      "check json",
      "json lint",
    ],
    icon: "ListChecks",
    status: "ready",
    popularity: 90,
    addedAt: "2026-11-05",
    related: ["json-formatter", "base64-encoder-decoder", "url-encoder-decoder"],
    content: {
      what: "The JSON Validator checks whether a piece of text is valid JSON according to the standard. If it is valid, you get a short report with the number of keys, values, arrays, and the maximum nesting depth. If it is not, the error message includes the line and column so you can fix it quickly.",
      howTo: [
        "Paste the JSON you want to check.",
        "Click Validate.",
        "Read the success summary or the exact error position.",
        "Fix the highlighted issue and validate again.",
      ],
      example:
        "A configuration file fails to load. The validator reports an unexpected token at line 14, column 9, which turns out to be a trailing comma after an object.",
      benefits: [
        "Clear error positions instead of vague parse failures.",
        "Statistics help you understand unfamiliar payloads.",
        "No data collection or server-side logging.",
        "Works offline after the page has loaded.",
      ],
      faqs: [
        {
          q: "What counts as valid JSON?",
          a: "Valid JSON follows the RFC 8259 grammar: double-quoted keys and strings, no trailing commas, and no comments. Values can be objects, arrays, strings, numbers, booleans, or null.",
        },
        {
          q: "Can it validate JSON with duplicates keys?",
          a: "Duplicate keys are technically allowed by the grammar, but most parsers keep the last value. The validator reports them as a warning because they often indicate a bug.",
        },
        {
          q: "Does it check JSON Schema?",
          a: "No. This tool checks JSON syntax only. Schema validation against a specific structure is a separate, more advanced feature.",
        },
      ],
    },
  },
  {
    slug: "base64-encoder-decoder",
    title: "Base64 Encoder / Decoder",
    description:
      "Encode text to Base64 or decode Base64 back to text with full Unicode support, including Khmer. See clear errors for invalid input.",
    category: "developer",
    keywords: [
      "base64 encoder",
      "base64 decoder",
      "encode base64",
      "decode base64",
      "base64 converter",
      "unicode base64",
    ],
    icon: "Binary",
    status: "ready",
    popularity: 88,
    addedAt: "2026-11-06",
    related: ["url-encoder-decoder", "json-formatter", "uuid-generator"],
    content: {
      what: "Base64 is a way to represent binary or text data using only safe ASCII characters. This tool encodes plain text into Base64 and decodes Base64 back into readable text. It handles UTF-8 correctly, so accents, emoji, and Khmer script survive the round trip.",
      howTo: [
        "Choose Encode or Decode mode.",
        "Paste your text into the input box.",
        "Click Convert to see the result.",
        "Copy the output or swap the input and output to go back.",
      ],
      example:
        "A developer needs to embed a short Khmer phrase in an email header. Encoding it to Base64 produces ASCII-safe text that can be decoded back without losing characters.",
      benefits: [
        "Correct handling of non-English text and emoji.",
        "Useful for API headers, data URLs, and debugging.",
        "Instant results with no upload.",
        "Clear errors when the Base64 is malformed.",
      ],
      faqs: [
        {
          q: "Is Base64 encryption?",
          a: "No. Base64 is an encoding, not encryption. Anyone can decode it. Use real encryption for secrets and never treat Base64 as protection.",
        },
        {
          q: "Why does decoding fail?",
          a: "The input may contain spaces, line breaks, or characters outside the Base64 alphabet, or its length may be invalid. Remove stray characters and try again.",
        },
        {
          q: "Does it support Khmer text?",
          a: "Yes. The tool converts text to UTF-8 bytes before encoding, so Khmer and other non-Latin scripts are preserved.",
        },
      ],
    },
  },
  {
    slug: "url-encoder-decoder",
    title: "URL Encoder / Decoder",
    description:
      "Percent-encode or decode URLs and query strings safely. Choose component mode for values or full-URL mode, with clear error handling.",
    category: "developer",
    keywords: [
      "url encoder",
      "url decoder",
      "percent encoding",
      "encode query string",
      "decode url",
      "uri encoder",
    ],
    icon: "Link2",
    status: "ready",
    popularity: 86,
    addedAt: "2026-11-07",
    related: ["base64-encoder-decoder", "json-formatter", "qr-code-generator"],
    content: {
      what: "The URL Encoder / Decoder converts characters into percent-encoded form and back again. Use component mode for a single query value, or full-URL mode when you want to keep reserved separators such as slashes and question marks. Decoding invalid sequences produces a clear error rather than a broken link.",
      howTo: [
        "Choose Encode or Decode.",
        "Pick Component for a value or Full URL for a complete link.",
        "Paste the URL or text and click Convert.",
        "Copy the result and test it in the browser.",
      ],
      example:
        "A search link contains a Khmer keyword and an ampersand inside the query value. Component encoding turns the value into a safe string that the destination page can read correctly.",
      benefits: [
        "Avoid broken links caused by spaces and special characters.",
        "Safely pass values between pages and APIs.",
        "Understand encoded URLs you receive from logs.",
        "No uploads and no tracking.",
      ],
      faqs: [
        {
          q: "What is the difference between component and full URL mode?",
          a: "Component mode encodes separators like /, ?, and &, which is correct for a single value. Full URL mode leaves those separators intact so the URL structure still works.",
        },
        {
          q: "Why do spaces become %20?",
          a: "Percent-encoding represents unsafe characters as a percent sign followed by two hexadecimal digits. %20 is the standard encoding for a space.",
        },
        {
          q: "What does URI malformed mean?",
          a: "The input contains a percent sign that is not followed by two valid hexadecimal digits. Fix or remove the broken sequence before decoding.",
        },
      ],
    },
  },
  {
    slug: "word-counter",
    title: "Word Counter",
    description:
      "Count words, characters, sentences, and paragraphs as you type. Get reading time and support for languages without spaces, including Khmer.",
    category: "ai-writing",
    keywords: [
      "word counter",
      "character counter",
      "count words online",
      "reading time calculator",
      "khmer word count",
      "text statistics",
    ],
    icon: "Type",
    status: "ready",
    popularity: 92,
    addedAt: "2026-11-08",
    related: ["text-case-converter", "markdown-editor", "image-compressor"],
    content: {
      what: "The Word Counter analyzes text in real time and reports words, characters, characters without spaces, sentences, paragraphs, and estimated reading time. It uses the browser's international text segmentation when available, which gives more accurate word counts for languages such as Khmer that do not use spaces between words.",
      howTo: [
        "Paste or type text into the editor.",
        "Watch the statistics update as you type.",
        "Check reading time based on an average pace of 200 words per minute.",
        "Clear the editor when you want to start a new document.",
      ],
      example:
        "A student pastes a 1,200-word essay and sees that it needs about 6 minutes to read, with 7,400 characters and 48 sentences.",
      benefits: [
        "Stay inside word limits for essays and applications.",
        "Plan social posts and meta descriptions by character count.",
        "Better handling of Khmer and other non-spaced scripts.",
        "No account and no text retention.",
      ],
      faqs: [
        {
          q: "How is reading time calculated?",
          a: "The estimate divides the word count by 200 words per minute and rounds up. Actual reading speed varies by content and reader.",
        },
        {
          q: "Does it count emoji as words?",
          a: "Emoji and symbols are not counted as words, but they are included in the character count. This matches how most word processors behave.",
        },
        {
          q: "Does the tool work with Khmer text?",
          a: "Yes. It uses Intl.Segmenter when supported, which finds word boundaries in Khmer without relying on spaces. Older browsers fall back to a simpler whitespace count.",
        },
      ],
    },
  },
  {
    slug: "text-case-converter",
    title: "Text Case Converter",
    description:
      "Convert text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, kebab-case, and more in one click.",
    category: "ai-writing",
    keywords: [
      "text case converter",
      "uppercase converter",
      "lowercase converter",
      "title case",
      "camelcase converter",
      "snake case",
    ],
    icon: "CaseUpper",
    status: "ready",
    popularity: 85,
    addedAt: "2026-11-09",
    related: ["word-counter", "markdown-editor", "url-encoder-decoder"],
    content: {
      what: "The Text Case Converter rewrites your text in common capitalization styles used by writers and developers. It supports uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, and kebab-case. The original text stays unchanged until you copy the result.",
      howTo: [
        "Paste or type your text.",
        "Choose a case style from the buttons.",
        "Review the converted result in the output area.",
        "Copy the result or reset the editor.",
      ],
      example:
        "A developer pastes \"User profile settings\" and converts it to snake_case for a database field: user_profile_settings.",
      benefits: [
        "Fix accidental caps lock text in seconds.",
        "Keep headings consistent across a document.",
        "Generate variable names for code.",
        "Preserve Unicode text while changing letter case.",
      ],
      faqs: [
        {
          q: "What is the difference between title case and sentence case?",
          a: "Title case capitalizes most major words, while sentence case capitalizes only the first word (and proper nouns, which this tool cannot detect).",
        },
        {
          q: "Will camelCase remove punctuation?",
          a: "Yes. Programming-oriented styles such as camelCase and snake_case treat spaces, hyphens, and underscores as word separators and rebuild the string without them.",
        },
        {
          q: "Does it work with Khmer text?",
          a: "Khmer has no letter case, so changing case leaves Khmer characters unchanged. Latin text in the same input is still converted normally.",
        },
      ],
    },
  },
  {
    slug: "percentage-calculator",
    title: "Percentage Calculator",
    description:
      "Solve common percentage questions: X% of Y, what percent X is of Y, and percent increase or decrease between two numbers.",
    category: "business-finance",
    keywords: [
      "percentage calculator",
      "percent of a number",
      "percent increase calculator",
      "percent decrease",
      "discount calculator",
      "percentage change",
    ],
    icon: "Percent",
    status: "ready",
    popularity: 87,
    addedAt: "2026-11-10",
    related: ["age-calculator", "gpa-calculator", "word-counter"],
    content: {
      what: "The Percentage Calculator handles three everyday percentage questions in one place. Find a percentage of a number, find what percentage one number is of another, or calculate the percentage change from an old value to a new value. Each mode shows the formula and the result so the answer is easy to verify.",
      howTo: [
        "Choose the type of percentage question.",
        "Enter the two numbers.",
        "Read the result and the formula used.",
        "Switch modes or reset to start another calculation.",
      ],
      example:
        "A shop raises a price from $80 to $100. The change is (100 − 80) ÷ 80 × 100 = 25%, so the price increased by 25%.",
      benefits: [
        "Check discounts, taxes, tips, and markups quickly.",
        "See the formula instead of a black-box answer.",
        "No rounding surprises for typical money values.",
        "Works on mobile while shopping or working.",
      ],
      faqs: [
        {
          q: "What is the formula for percent change?",
          a: "Percent change = (new value − old value) ÷ old value × 100. A positive result is an increase and a negative result is a decrease.",
        },
        {
          q: "Why can a percentage be greater than 100?",
          a: "That simply means the new value is more than double the old value. For example, going from 20 to 50 is a 150% increase.",
        },
        {
          q: "How do I calculate a discount?",
          a: "Use the first mode: enter the discount percentage and the original price. Subtract the result from the original price to get the sale price.",
        },
      ],
    },
  },
  {
    slug: "age-calculator",
    title: "Age Calculator",
    description:
      "Calculate exact age in years, months, and days from a birth date. See total days, weeks, and the next birthday countdown.",
    category: "productivity",
    keywords: [
      "age calculator",
      "calculate age",
      "date of birth calculator",
      "years months days",
      "next birthday",
      "age in days",
    ],
    icon: "CalendarDays",
    status: "ready",
    popularity: 84,
    addedAt: "2026-11-11",
    related: ["percentage-calculator", "gpa-calculator", "password-generator"],
    content: {
      what: "The Age Calculator finds the exact time between a date of birth and a chosen reference date. It returns years, months, and days, along with total days, total weeks, and the number of days until the next birthday. The calculation accounts for leap years and different month lengths.",
      howTo: [
        "Enter the date of birth.",
        "Leave the reference date as today, or choose another date.",
        "Click Calculate.",
        "Review the exact age and the next birthday countdown.",
      ],
      example:
        "Someone born on 15 March 2000 is 26 years, 8 months, and 1 day old on 16 November 2026, with 119 days until their next birthday.",
      benefits: [
        "Exact results instead of rough year subtraction.",
        "Useful for forms, school records, and event planning.",
        "Works for past and future reference dates.",
        "No personal data is sent anywhere.",
      ],
      faqs: [
        {
          q: "How are months counted?",
          a: "The tool borrows days from the previous month when needed, following the same approach as most date libraries. This keeps results correct across months with 28, 30, and 31 days.",
        },
        {
          q: "What about people born on 29 February?",
          a: "In non-leap years, the next birthday countdown treats 28 February as the reference day, which is the common civil convention.",
        },
        {
          q: "Can I calculate age on a future date?",
          a: "Yes. Change the reference date to any date after the birth date. The result shows the age at that point in time.",
        },
      ],
    },
  },
  {
    slug: "gpa-calculator",
    title: "GPA Calculator",
    description:
      "Calculate weighted GPA on the 4.0 scale with course credits and letter grades. Add or remove courses and see total credits instantly.",
    category: "student-education",
    keywords: [
      "gpa calculator",
      "weighted gpa",
      "college gpa calculator",
      "grade point average",
      "4.0 scale gpa",
      "semester gpa",
    ],
    icon: "GraduationCap",
    status: "ready",
    popularity: 82,
    addedAt: "2026-11-12",
    related: ["percentage-calculator", "age-calculator", "word-counter"],
    content: {
      what: "The GPA Calculator computes a weighted grade point average using course credits and letter grades on the standard 4.0 scale. Each course contributes credits × grade points, and the total is divided by total credits. You can add as many courses as your semester requires and remove any row.",
      howTo: [
        "Enter a course name, its credit hours, and the letter grade.",
        "Add more courses for the full semester.",
        "Remove any course that does not belong.",
        "Read the weighted GPA and total credits at the bottom.",
      ],
      example:
        "An A in a 3-credit course (12 points) and a B in a 4-credit course (12 points) give 24 points over 7 credits, for a GPA of 3.43.",
      benefits: [
        "Understand how credits affect your average.",
        "Plan which grades matter most this semester.",
        "No sign-up and no stored transcript data.",
        "Works for high school and university scales.",
      ],
      faqs: [
        {
          q: "Which grade scale is used?",
          a: "The calculator uses A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, B− = 2.7, C+ = 2.3, C = 2.0, C− = 1.7, D+ = 1.3, D = 1.0, D− = 0.7, and F = 0. Some schools use slightly different values.",
        },
        {
          q: "What is a weighted GPA?",
          a: "Weighted means courses with more credits affect the result more. A 4-credit course counts twice as much as a 2-credit course with the same grade.",
        },
        {
          q: "Does it calculate cumulative GPA?",
          a: "You can include every completed course to estimate a cumulative GPA, or only this semester's courses for a term GPA.",
        },
      ],
    },
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    description:
      "Generate strong random passwords with the browser's cryptographic API. Choose length and character sets, then copy the result.",
    category: "security-privacy",
    keywords: [
      "password generator",
      "strong password",
      "random password",
      "secure password generator",
      "crypto password",
      "password creator",
    ],
    icon: "KeyRound",
    status: "ready",
    popularity: 91,
    addedAt: "2026-11-13",
    related: ["uuid-generator", "base64-encoder-decoder", "age-calculator"],
    content: {
      what: "The Password Generator creates random passwords using crypto.getRandomValues, not Math.random. You control the length and which character sets are included, and the tool guarantees at least one character from each selected set. Passwords are generated locally and never transmitted.",
      howTo: [
        "Choose a length between 8 and 64 characters.",
        "Select uppercase, lowercase, numbers, and symbols.",
        "Optionally exclude characters that look similar.",
        "Click Generate, then copy the password into your password manager.",
      ],
      example:
        "A 20-character password using all four character sets has roughly 130 bits of entropy, which is far beyond what brute-force attacks can practically guess.",
      benefits: [
        "Cryptographically secure randomness from the browser.",
        "No logging, storage, or network requests.",
        "Clear strength estimate based on entropy.",
        "Works offline once the page is loaded.",
      ],
      faqs: [
        {
          q: "Why not use Math.random?",
          a: "Math.random is not designed for security and can be predictable. crypto.getRandomValues uses the operating system's secure random source.",
        },
        {
          q: "How long should a password be?",
          a: "Use at least 16 characters for important accounts. Length matters more than complexity, and a password manager makes long random passwords practical.",
        },
        {
          q: "Are generated passwords saved?",
          a: "No. They exist only in the page until you navigate away. Copy the password into a trusted password manager before leaving.",
        },
      ],
    },
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    description:
      "Generate one or many RFC 4122 version 4 UUIDs with crypto.randomUUID. Copy them all or download a text file.",
    category: "developer",
    keywords: [
      "uuid generator",
      "guid generator",
      "random uuid",
      "uuid v4",
      "generate uuid online",
      "bulk uuid",
    ],
    icon: "Fingerprint",
    status: "ready",
    popularity: 83,
    addedAt: "2026-11-14",
    related: ["password-generator", "base64-encoder-decoder", "json-formatter"],
    content: {
      what: "The UUID Generator creates version 4 UUIDs using the browser's crypto.randomUUID function. You can generate up to 100 at once, switch to uppercase, copy the list, or download it as a text file. Each value is a standard 128-bit identifier suitable for databases and distributed systems.",
      howTo: [
        "Choose how many UUIDs you need.",
        "Select lowercase or uppercase output.",
        "Click Generate to create a fresh set.",
        "Copy individual values or download the whole list.",
      ],
      example:
        "A developer needs 25 IDs for seed data. One click generates 25 unique version 4 UUIDs, ready to paste into a SQL insert statement.",
      benefits: [
        "Uses the browser's cryptographic random UUID implementation.",
        "Bulk generation saves repetitive work.",
        "No duplicates in normal use, because v4 IDs are random.",
        "Nothing is sent to a server.",
      ],
      faqs: [
        {
          q: "What is a UUID version 4?",
          a: "It is a 128-bit identifier generated mostly from random bits, formatted as 8-4-4-4-12 hexadecimal characters. The version and variant bits identify it as a v4 UUID.",
        },
        {
          q: "Can two generated UUIDs collide?",
          a: "A collision is theoretically possible but astronomically unlikely. For practical systems, v4 UUIDs are safe to treat as unique.",
        },
        {
          q: "Are UUIDs guessable?",
          a: "Version 4 UUIDs are random, but they are identifiers, not secrets. Do not use a UUID as an authentication token or password.",
        },
      ],
    },
  },
  {
    slug: "markdown-editor",
    title: "Markdown Editor",
    description:
      "Write Markdown with a live sanitized preview, formatting toolbar, word count, copy, and download. Your draft stays in the browser.",
    category: "ai-writing",
    keywords: [
      "markdown editor",
      "markdown preview",
      "write markdown online",
      "markdown to html preview",
      "markdown toolbar",
      "free markdown editor",
    ],
    icon: "PenLine",
    status: "ready",
    popularity: 80,
    addedAt: "2026-11-15",
    related: ["word-counter", "text-case-converter", "json-formatter"],
    content: {
      what: "The Markdown Editor is a split writing space with a formatting toolbar and a live preview. It supports headings, lists, links, code blocks, tables, and other common Markdown through GitHub-flavored extensions. Rendered HTML is sanitized before display, so pasted content cannot inject scripts.",
      howTo: [
        "Type or paste Markdown on the left side.",
        "Use the toolbar buttons to insert common formatting.",
        "Review the sanitized preview on the right.",
        "Copy the Markdown or download it as a .md file.",
      ],
      example:
        "A developer drafts release notes with headings, bullet lists, and inline code. The live preview shows how the notes will look on GitHub before committing the file.",
      benefits: [
        "Live preview without switching apps.",
        "Sanitized HTML protects against script injection.",
        "Formatting toolbar for people new to Markdown.",
        "Drafts never leave the device.",
      ],
      faqs: [
        {
          q: "Is the preview HTML safe?",
          a: "Yes. Rendered HTML passes through a sanitizer that removes scripts, event handlers, and other unsafe markup before it is shown.",
        },
        {
          q: "Does it support tables and task lists?",
          a: "Yes. GitHub-flavored Markdown extensions are enabled, including tables, strikethrough, autolinks, and task lists.",
        },
        {
          q: "Will my draft be saved if I close the page?",
          a: "Not automatically. Copy or download your Markdown before leaving. Storing drafts locally could be added later as an explicit, opt-in feature.",
        },
      ],
    },
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
