import type { Tool } from "@/types/tool";

/** Batch L: language and accessibility tools. */
export const batchLTools: Tool[] = [
  {
    slug: "color-blindness-simulator",
    title: "Color Blindness Simulator",
    description:
      "Upload an image and preview how it looks with common color vision deficiencies. Apply canvas color matrices, compare against the original, and download the simulated result locally.",
    category: "language-accessibility",
    keywords: [
      "color blindness simulator",
      "color vision deficiency preview",
      "protanopia simulator",
      "deuteranopia simulation",
      "color blind filter",
      "accessible color preview",
    ],
    icon: "Palette",
    status: "ready",
    popularity: 84,
    addedAt: "2026-11-22",
    related: ["color-contrast-checker", "image-resizer", "image-format-converter"],
    content: {
      what: "The Color Blindness Simulator takes an image you choose and runs each pixel through a color transformation matrix that approximates a specific type of color vision deficiency. You can switch between protanopia, deuteranopia, tritanopia, their milder anomaly forms, and total or partial achromatopsia. The original stays visible next to the simulation so you can judge how much information a color cue loses. Everything runs in your browser: the image is read with the Canvas API and never uploaded to a server.",
      howTo: [
        "Choose a JPEG, PNG, or WebP image from your device.",
        "Pick a deficiency type from the selector buttons.",
        "Compare the original with the simulated canvas in the preview.",
        "Download the simulated image as a PNG when it looks right.",
      ],
      example:
        "A product designer uploads a chart that uses red and green lines, selects Deuteranopia, and sees the two lines collapse into nearly identical shades. They then replace the color-only distinction with line styles.",
      benefits: [
        "Spot color-only cues that disappear for color blind users.",
        "Test eight common deficiency types without installing software.",
        "Keep the image private because processing happens on your device.",
        "Export a PNG you can attach to an accessibility review.",
      ],
      faqs: [
        {
          q: "Are these simulations medically exact?",
          a: "No. The matrices are a well-known approximation based on color-matching research. They are useful for design review, not for diagnosing or measuring an individual person's vision.",
        },
        {
          q: "Which image formats are accepted?",
          a: "JPEG, PNG, and WebP files up to 20 MB. Other formats are rejected before processing so you get a clear error instead of a blank canvas.",
        },
        {
          q: "Why does my large image look smaller?",
          a: "Images larger than 2048 pixels on the longest side are scaled to a 2048 px canvas so the per-pixel operation stays responsive. The downloaded PNG uses that same preview size.",
        },
        {
          q: "Does the tool change the original file?",
          a: "No. Your file is read into a temporary object URL and drawn to an in-memory canvas. The source image on disk is never modified.",
        },
      ],
    },
  },
  {
    slug: "nato-phonetic-converter",
    title: "NATO Phonetic Alphabet Converter",
    description:
      "Turn plain text into the NATO phonetic alphabet instantly. Each letter becomes its code word, while digits and punctuation pass through, with copy and download for spelling things out clearly.",
    category: "language-accessibility",
    keywords: [
      "NATO phonetic alphabet converter",
      "phonetic spelling tool",
      "ICAO alphabet translator",
      "spell words over radio",
      "military alphabet generator",
      "letter code words",
    ],
    icon: "Languages",
    status: "ready",
    popularity: 78,
    addedAt: "2026-11-22",
    related: ["morse-code-translator", "text-case-converter", "word-counter"],
    content: {
      what: "The NATO Phonetic Alphabet Converter replaces each A–Z letter with its internationally agreed code word, such as Alfa for A or Zulu for Z. This is the alphabet used by pilots, air traffic controllers, and military operators to spell out letters unambiguously when sound quality is poor. Non-letter characters such as digits, spaces, and punctuation are left exactly as typed, because the standard defines words only for the 26 letters. A full reference table is included below the result.",
      howTo: [
        "Type or paste the text you need to spell out.",
        "Watch each letter convert to its NATO code word in the result.",
        "Use the reference table to check any letter you are unsure about.",
        "Copy or download the converted text for later use.",
      ],
      example:
        "An event coordinator types the confirmation code B7-KL and reads out “Bravo 7 – Kilo Lima” over a crackly phone line to avoid confusing B with D or K with T.",
      benefits: [
        "Eliminate confusion between similar sounding letters.",
        "Conversion happens live as you type, with no extra click.",
        "Works for any Latin text, including names and booking codes.",
        "The output can be copied or saved as a plain text file.",
      ],
      faqs: [
        {
          q: "What about the number 7 or other digits?",
          a: "Digits are passed through unchanged. The official phonetic alphabet only assigns words to letters, so there is no standardized code word for a digit in this tool.",
        },
        {
          q: "Is it Alfa with one F or Alpha?",
          a: "The NATO/ICAO standard spells it Alfa with a single F. Other variants exist in casual use, but this tool follows the official spelling for every entry, including Juliett.",
        },
        {
          q: "Does it handle accented or non-Latin letters?",
          a: "Only A–Z are converted. Other characters, including accented letters and non-Latin scripts, are left untouched rather than guessed.",
        },
        {
          q: "Is my text stored anywhere?",
          a: "No. The conversion is computed in your browser and nothing is sent to a server or saved after you close the page.",
        },
      ],
    },
  },
  {
    slug: "morse-code-translator",
    title: "Morse Code Translator",
    description:
      "Translate text to International Morse code and back again, with honest handling of unsupported characters and optional Web Audio playback of dots and dashes right in your browser.",
    category: "language-accessibility",
    keywords: [
      "Morse code translator",
      "text to Morse code",
      "Morse decoder",
      "International Morse converter",
      "play Morse audio",
      "dots and dashes generator",
    ],
    icon: "Binary",
    status: "ready",
    popularity: 80,
    addedAt: "2026-11-22",
    related: ["nato-phonetic-converter", "text-case-converter", "url-encoder-decoder"],
    content: {
      what: "The Morse Code Translator converts text into International Morse code and decodes Morse back into readable text. It covers the 26 Latin letters, the ten digits, and common punctuation. Whitespace becomes a word separator written as a slash, and letters are separated by single spaces. When a character has no Morse equivalent, it is reported instead of silently invented, and unknown Morse groups are marked with a square during decoding. You can also play the result with correctly proportioned dots, dashes, and gaps using your browser's audio system.",
      howTo: [
        "Choose whether you are encoding text or decoding Morse.",
        "Enter your text or dot-and-dash sequence in the input box.",
        "Read the converted result and check any warnings about unsupported symbols.",
        "Optionally adjust the dot length and press Play to hear the signal.",
      ],
      example:
        "A hiker types SOS and gets ... --- ..., then presses Play to hear the three short, three long, three short pattern before sending it by flashlight.",
      benefits: [
        "Two-way conversion for both studying and sending messages.",
        "Standard Morse timing makes audio playback sound natural.",
        "Unsupported Unicode is reported openly instead of mangled.",
        "Copy or download the result without leaving the page.",
      ],
      faqs: [
        {
          q: "Why were some of my characters skipped?",
          a: "International Morse code only defines letters, digits, and a small set of punctuation. Characters outside that set, including most Unicode symbols and non-Latin scripts, have no standard Morse representation and are listed in a warning.",
        },
        {
          q: "How should I separate words and letters?",
          a: "Use a single space between letters and a forward slash surrounded by spaces between words. For example, “HI THERE” becomes .... .. / - . .... . .-. .",
        },
        {
          q: "What does the □ symbol mean when decoding?",
          a: "It marks a Morse group that did not match any known letter, digit, or punctuation. It usually means a group was mistyped or had irregular spacing.",
        },
        {
          q: "Does playback need any setup?",
          a: "No files or permissions are needed. Sound is generated with the Web Audio API after you press Play. If nothing is heard, check that your device is not muted.",
        },
      ],
    },
  },
  {
    slug: "khmer-numeral-converter",
    title: "Khmer Numeral Converter",
    description:
      "Convert between ASCII digits 0–9 and the modern Khmer numerals ០–៩, with a verified one-to-one mapping, two-way conversion and honest handling of everything outside that range.",
    category: "language-accessibility",
    keywords: [
      "Khmer numeral converter",
      "Khmer numbers translator",
      "ASCII to Khmer digits",
      "Khmer digit converter",
      "convert ០ ១ ២ ៣",
      "Cambodian numerals",
    ],
    icon: "Languages",
    status: "ready",
    popularity: 79,
    addedAt: "2026-11-22",
    related: ["number-to-words", "nato-phonetic-converter", "text-case-converter"],
    content: {
      what: "The Khmer Numeral Converter maps each ASCII digit to its modern Khmer counterpart and back again: 0 becomes ០, 1 becomes ១, and so on through 9 becoming ៩. It works on a character-by-character basis, so phone numbers, years, and IDs keep their surrounding text and punctuation. The mapping is limited to the ten modern Khmer digits in the Unicode block U+17E0 through U+17E9, which is the range in common use today. The tool makes no claims about legacy or unassigned Khmer numeral code points and leaves any such characters untouched.",
      howTo: [
        "Choose the direction: ASCII digits to Khmer, or Khmer digits to ASCII.",
        "Type or paste numbers, with or without surrounding text.",
        "Read the converted result in the output box.",
        "Use Swap with result to convert the output straight back.",
      ],
      example:
        "A translator pastes the phone number 012 345 678 and gets ០១២ ៣៤៥ ៦៧៨, preserving the spaces exactly so the number stays readable.",
      benefits: [
        "Fast digit conversion without changing other characters.",
        "Both directions available with a single swap action.",
        "Based only on the verified modern Khmer digit range.",
        "Runs locally with no upload or account required.",
      ],
      faqs: [
        {
          q: "Which Khmer digits does this support?",
          a: "Only the ten modern digits ០ through ៩, at Unicode code points U+17E0 to U+17E9. These are the digits used in everyday Khmer writing today.",
        },
        {
          q: "What about older or historic Khmer numeral symbols?",
          a: "They are not converted. Some historic or unassigned code points have been proposed over time, and this tool deliberately avoids guessing at them; those characters pass through unchanged.",
        },
        {
          q: "Will letters or punctuation be changed?",
          a: "No. Only matching digit characters are replaced. Spaces, letters, Khmer text, and punctuation are copied to the output exactly as entered.",
        },
        {
          q: "Can I convert a whole phone number at once?",
          a: "Yes. Paste the full number including separators and the tool converts only the digits, keeping the formatting intact.",
        },
      ],
    },
  },
  {
    slug: "number-to-words",
    title: "Number to Words",
    description:
      "Write any integer or decimal number in English words, including negatives, large values and fractions read digit by digit, with precise string-based conversion that avoids floating point errors.",
    category: "language-accessibility",
    keywords: [
      "number to words",
      "write numbers in words",
      "integer to English words",
      "decimal to words converter",
      "spell out a number",
      "large number words",
    ],
    icon: "Type",
    status: "ready",
    popularity: 77,
    addedAt: "2026-11-22",
    related: ["khmer-numeral-converter", "word-counter", "readability-score"],
    content: {
      what: "The Number to Words tool spells out numbers in standard English. Enter an integer or a decimal, optionally with a leading minus sign, and it produces phrases such as one thousand two hundred thirty-four or minus twelve point zero five. The integer part is broken into groups of three and matched with scale names like thousand, million, and billion. Because the value is processed as text rather than as a floating-point number, very large integers keep their full precision. Digits after a decimal point are read one at a time, which is how numbers such as prices and measurements are normally spoken.",
      howTo: [
        "Type a plain number into the input, for example 1234567 or -8.25.",
        "The English words appear automatically in the result box.",
        "Try one of the example buttons to see how decimals and negatives are handled.",
        "Copy or download the written form when you are happy with it.",
      ],
      example:
        "An accountant enters 1000000001 and reads the result “one billion one” when dictating a figure into a report, avoiding ambiguity about how many zeros were spoken.",
      benefits: [
        "Handles negatives, decimals, and very large integers correctly.",
        "String-based processing avoids floating point rounding surprises.",
        "Useful for invoices, legal text, checks, and accessibility read-aloud.",
        "Updates instantly as you type with no submit step.",
      ],
      faqs: [
        {
          q: "Can I enter commas or scientific notation?",
          a: "No. Enter a plain number such as 1234567.89 or -25. Comma separators and forms like 1e6 are rejected with a message so the output stays predictable.",
        },
        {
          q: "How are decimals read?",
          a: "Each digit after the decimal point is spoken on its own, preceded by the word point. For example, 12.05 becomes twelve point zero five.",
        },
        {
          q: "How large a number can I convert?",
          a: "Integers are handled as text, so they do not lose precision. Scale names are defined up to vigintillion; beyond that, the remaining magnitude is written as a power of ten.",
        },
        {
          q: "Do you use the word 'and' in numbers?",
          a: "No. This tool uses the common American style, saying one hundred twenty-three rather than one hundred and twenty-three. Hyphens are used in compound tens such as twenty-one.",
        },
      ],
    },
  },
];
