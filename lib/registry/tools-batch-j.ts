import type { Tool } from "@/types/tool";

/** Batch J: social-media planning, grid design, profiles, images, and tracking. */
export const batchJTools: Tool[] = [
  {
    slug: "content-calendar-generator",
    title: "Content Calendar Generator",
    description:
      "Plan a month of social posts on a simple calendar grid. Add posts to any date, browse months, and export the whole schedule as a CSV you can open in a spreadsheet.",
    category: "social-media",
    keywords: [
      "content calendar generator",
      "social media calendar",
      "monthly post planner",
      "editorial calendar",
      "post schedule template",
      "content planner",
    ],
    icon: "CalendarDays",
    status: "ready",
    popularity: 80,
    addedAt: "2026-11-22",
    related: [
      "instagram-grid-planner",
      "link-in-bio-generator",
      "social-caption-counter",
      "days-between-dates",
    ],
    content: {
      what: "The Content Calendar Generator gives you a Monday-first monthly grid where each date can hold as many planned posts as you like. Fill in a title, platform, publish time, and notes, then click any day to attach the next post to it. Every entry stays in the current browser tab, and the whole schedule can be exported as a CSV with one row per post. It is a lightweight way to move ideas out of a notes app and into a repeatable publishing rhythm.",
      howTo: [
        "Pick the month with the Prev and Next buttons, or jump back to the current month with Today.",
        "Click a date in the grid, then enter the post title, platform, time, and any notes.",
        "Press Add post and repeat for each idea you want to schedule.",
        "Review the scheduled list, export the CSV, or use Reset to start a fresh month.",
      ],
      example:
        "A small bakery plans a launch week: a teaser reel on Monday 4 November, a carousel on Wednesday, and a story reminder on Friday. They export the calendar to CSV and paste it into their team spreadsheet so the designer knows which assets to prepare.",
      benefits: [
        "See an entire month at a glance instead of scanning a long text list.",
        "Assign several posts to one date when a campaign needs more than one touchpoint.",
        "Export a structured CSV that works in Excel, Sheets, and most project tools.",
        "Nothing is uploaded or stored on a server, so campaign ideas stay private until you export them.",
      ],
      faqs: [
        {
          q: "Can I plan into the next month?",
          a: "Yes. Use the Prev and Next controls to move between months. The date field accepts any valid day, so posts you add while viewing one month can be scheduled into another.",
        },
        {
          q: "How many posts can go on one day?",
          a: "There is no fixed limit. The calendar cell shows the first two titles and a count of the rest, while the full scheduled list and CSV include every post you added.",
        },
        {
          q: "Will my calendar be saved when I close the tab?",
          a: "No. The plan lives in memory only. Export the CSV before you leave if you want to keep it or share it with teammates.",
        },
        {
          q: "Can I edit a post after adding it?",
          a: "Not directly. Remove the unwanted post from the scheduled list and add a corrected one. Because export sorts by date and time, the CSV will still read in publishing order.",
        },
      ],
    },
  },
  {
    slug: "instagram-grid-planner",
    title: "Instagram Grid Planner",
    description:
      "Upload local photos and arrange them in a three-column profile grid preview. Reorder tiles with simple arrow buttons, remove any image, and see your posting sequence before you publish.",
    category: "social-media",
    keywords: [
      "instagram grid planner",
      "profile grid preview",
      "instagram feed planner",
      "photo grid maker",
      "arrange instagram posts",
      "feed layout tool",
    ],
    icon: "Image",
    status: "ready",
    popularity: 79,
    addedAt: "2026-11-22",
    related: [
      "content-calendar-generator",
      "social-image-resizer",
      "image-resizer",
      "image-compressor",
    ],
    content: {
      what: "The Instagram Grid Planner lets you load several photos at once and see them as a three-column feed, the same shape visitors scan on a profile. Every file is read through a local object URL, so nothing is uploaded. Because there is no drag-and-drop dependency, each tile has plain arrow buttons that shift it one slot left or right; a remove button deletes it. The tool revokes each object URL when its image is removed or the page is closed, keeping browser memory tidy.",
      howTo: [
        "Choose several JPEG, PNG, or WebP images from your device.",
        "Watch them appear in a three-column grid in the order you selected them.",
        "Use the left and right arrow buttons on a tile until the sequence looks right.",
        "Remove any unwanted tile, or clear the whole grid and start again.",
      ],
      example:
        "A photographer uploads nine images for a launch week, moves the bright hero shot into the first three slots to form a strong top row, and removes two duplicates before saving the final order in her planning notes.",
      benefits: [
        "Preview the visual rhythm of a feed before anything is posted publicly.",
        "Reorder with keyboard-friendly buttons instead of relying on a mouse drag gesture.",
        "Images stay on your device and are never sent to a remote service.",
        "Object URLs are released on removal and unmount, so large batches do not leak memory.",
      ],
      faqs: [
        {
          q: "Does this publish anything to Instagram?",
          a: "No. It is a planning preview only. The grid exists in your browser tab and cannot post, schedule, or edit anything on a social account.",
        },
        {
          q: "What file types and sizes are accepted?",
          a: "JPEG, PNG, and WebP images up to 20 MB each. Larger or unsupported files are skipped with a message so the rest of your batch still loads.",
        },
        {
          q: "Why do I move tiles with buttons instead of dragging?",
          a: "Button-based reordering works with a mouse, touch, and keyboard, and avoids adding an external drag library. Each press moves a tile exactly one position.",
        },
        {
          q: "Will my grid still be there tomorrow?",
          a: "No. The arrangement is temporary and disappears when the tab closes. Write down the final order or screenshot the grid if you need to keep it.",
        },
      ],
    },
  },
  {
    slug: "link-in-bio-generator",
    title: "Link-in-Bio Page Generator",
    description:
      "Build a clean link-in-bio page with a name, bio, avatar, theme, and buttons. Preview it live, then export one self-contained HTML file with escaped text and sanitized URLs.",
    category: "social-media",
    keywords: [
      "link in bio generator",
      "link in bio page",
      "social bio link page",
      "single file html page",
      "bio link builder",
      "custom link page",
    ],
    icon: "Link2",
    status: "ready",
    popularity: 78,
    addedAt: "2026-11-22",
    related: [
      "utm-link-builder",
      "content-calendar-generator",
      "open-graph-generator",
      "qr-code-generator",
    ],
    content: {
      what: "The Link-in-Bio Page Generator turns a profile and a list of links into a polished page that lives in a single HTML file. You set a display name, handle, short bio, optional avatar URL, theme, and accent color, then add as many labelled links as you need. The preview updates as you type. On export, every piece of user text is escaped and every URL is checked against an allowlist of http, https, mailto, tel, and same-site relative paths, so the downloaded file is safe to open or host anywhere.",
      howTo: [
        "Enter your name, handle, short bio, and an optional avatar image URL.",
        "Choose a light or dark theme and pick an accent color.",
        "Add each link with a label and a full URL, removing any you do not want.",
        "Check the live preview, then copy or download the self-contained HTML file.",
      ],
      example:
        "A podcast host adds links to the latest episode, a newsletter signup, and a contact email, picks a dark theme with a purple accent, and downloads one bio.html file to upload to her hosting account.",
      benefits: [
        "Get a hosted-page look without an account, database, or page builder.",
        "One HTML file with inline styles means no external scripts or dependencies.",
        "HTML escaping and URL sanitizing protect against accidental script injection.",
        "The live preview makes it easy to spot a broken or missing link before export.",
      ],
      faqs: [
        {
          q: "Can I host the exported file myself?",
          a: "Yes. It is a plain HTML document with embedded CSS, so you can upload it to any static host or open it directly from your computer.",
        },
        {
          q: "What happens to a link with an unsafe URL?",
          a: "URLs using schemes such as javascript: or data: are rejected and left out of the exported page. Use a full https:// URL for outbound links.",
        },
        {
          q: "Can I use an avatar hosted elsewhere?",
          a: "Yes, as long as you provide a full http or https image URL. The address is escaped before it is written into the page.",
        },
        {
          q: "Do the buttons open in a new tab?",
          a: "External http and https links open in a new tab with noopener and noreferrer set. Mail, phone, and relative links stay in the current tab.",
        },
      ],
    },
  },
  {
    slug: "social-image-resizer",
    title: "Social Media Image Resizer",
    description:
      "Resize a photo to the exact dimensions used by Instagram, Facebook, X, LinkedIn, Pinterest, and YouTube. Crop or fit with padding, choose PNG or JPEG, and download the result.",
    category: "social-media",
    keywords: [
      "social media image resizer",
      "instagram post size",
      "youtube thumbnail size",
      "crop image to ratio",
      "resize photo online",
      "social image dimensions",
    ],
    icon: "Scaling",
    status: "ready",
    popularity: 77,
    addedAt: "2026-11-22",
    related: [
      "instagram-grid-planner",
      "image-resizer",
      "image-cropper",
      "image-format-converter",
    ],
    content: {
      what: "The Social Media Image Resizer matches a local photo to the pixel sizes platforms expect. Pick a preset for a square post, a vertical story, a 16:9 thumbnail, or another common format, then choose whether to crop the edges to fill the frame or fit the whole photo with colored padding. The drawing happens on a canvas in your browser, and the result can be saved as JPEG with adjustable quality or as lossless PNG. Custom width and height fields are available when a preset does not fit your plan.",
      howTo: [
        "Upload a JPEG, PNG, or WebP photo from your device.",
        "Select a platform preset, or type a custom width and height between 16 and 4096 pixels.",
        "Choose Crop to fill or Fit with padding, and pick an output format and quality.",
        "Click Resize image, preview the result, then download it.",
      ],
      example:
        "A creator has a 4000 × 3000 landscape photo but needs a 1080 × 1350 Instagram reel cover. Crop to fill keeps the subject centered and removes the excess sides, producing a sharp JPEG ready to upload.",
      benefits: [
        "Presets cover the most requested feed, story, pin, and thumbnail sizes.",
        "Crop and fit modes handle both tight compositions and full-image layouts.",
        "JPEG quality control keeps file sizes reasonable for fast uploads.",
        "All processing is local, so private or unreleased images never leave the device.",
      ],
      faqs: [
        {
          q: "What is the difference between crop and fit?",
          a: "Crop to fill scales the image until it covers the target and trims the surplus edges. Fit with padding keeps the entire image and fills the empty space with the color you choose.",
        },
        {
          q: "Which output format should I use?",
          a: "JPEG is smaller and ideal for photographs. PNG preserves sharp edges and transparency, which suits logos and graphics, but produces larger files.",
        },
        {
          q: "Can I enter my own dimensions?",
          a: "Yes. The width and height fields accept any value from 16 to 4096 pixels, and values outside that range are clamped before the canvas is created.",
        },
        {
          q: "Does resizing remove metadata from the photo?",
          a: "Yes. The image is redrawn on a new canvas and re-encoded, so EXIF data such as GPS location is not carried into the downloaded file.",
        },
      ],
    },
  },
  {
    slug: "utm-link-builder",
    title: "UTM Link Builder",
    description:
      "Create tracked campaign links with utm_source, medium, campaign, term, and content. Validate the destination, encode parameters correctly, and copy the finished URL in one click.",
    category: "social-media",
    keywords: [
      "utm link builder",
      "utm parameter generator",
      "campaign url builder",
      "track social links",
      "utm tracking url",
      "google analytics url builder",
    ],
    icon: "Link2",
    status: "ready",
    popularity: 76,
    addedAt: "2026-11-22",
    related: [
      "link-in-bio-generator",
      "url-encoder-decoder",
      "content-calendar-generator",
      "social-caption-counter",
    ],
    content: {
      what: "The UTM Link Builder appends the five standard campaign parameters to any http or https URL. You enter a destination, fill in source, medium, campaign, term, and content, and the tool produces a correctly encoded tracked link. Existing query strings are preserved, and empty fields are removed so the URL stays clean. Quick presets cover common channel pairs such as email newsletters, social bios, paid search, and partner referrals, and you can import the UTM values from a tracked URL to edit them.",
      howTo: [
        "Paste the destination page URL, including https://.",
        "Fill in the source, medium, and campaign fields, adding term or content if needed.",
        "Optionally use a quick preset to fill a common source and medium pair.",
        "Copy or download the generated tracked link and use it in your campaign.",
      ],
      example:
        "A team promotes a spring sale with the URL https://shop.example.com/sale and sets source to newsletter, medium to email, and campaign to spring-sale-2026. The tool returns a link with three encoded utm parameters appended after the existing path.",
      benefits: [
        "Avoid hand-typing query strings and the encoding mistakes that come with them.",
        "Preserve parameters already on the URL, such as affiliate or ref codes.",
        "Quick presets keep source and medium naming consistent across campaigns.",
        "Import from an existing tracked link to reuse or correct its parameters.",
      ],
      faqs: [
        {
          q: "Does this send data to Google Analytics?",
          a: "No. The tool only constructs a URL in your browser. Analytics platforms read the utm_ parameters later, when someone follows the link you share.",
        },
        {
          q: "What URL formats are accepted?",
          a: "Only absolute http and https URLs with a hostname. A relative path or a bare domain without a scheme is rejected so the resulting link is unambiguous.",
        },
        {
          q: "Will my existing query parameters be lost?",
          a: "No. The destination is parsed as a URL, so current parameters stay in place. Only the utm_ keys you fill in are added or updated.",
        },
        {
          q: "Why use URLSearchParams instead of string concatenation?",
          a: "It handles spaces, ampersands, equals signs, and non-ASCII text correctly, producing a link that works reliably in browsers and analytics reports.",
        },
      ],
    },
  },
];
