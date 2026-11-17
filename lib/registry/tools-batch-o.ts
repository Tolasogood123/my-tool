import type { Tool } from "@/types/tool";

/** Batch O: developer utilities for scheduling, CSS styling, project config and mock data. */
export const batchOTools: Tool[] = [
  {
    slug: "cron-generator",
    title: "Cron Expression Generator",
    description:
      "Build a 5-field cron schedule with visual fields, read a plain-English explanation, and preview the next five run times. All parsing and date math runs locally in your browser.",
    category: "developer",
    keywords: ["cron expression generator", "cron builder", "crontab schedule generator", "cron job calculator", "cron schedule creator", "next cron run times"],
    icon: "Clock3",
    status: "ready",
    popularity: 83,
    addedAt: "2026-11-22",
    related: ["unix-timestamp-converter", "days-between-dates", "mock-json-generator", "pomodoro-timer"],
    content: {
      what: "The Cron Expression Generator turns a set of simple drop-downs and custom fields into a standard five-field crontab expression. It then explains what the schedule means in plain English and walks the calendar in your browser to show the next five moments the job would run. Every token is validated as you type, and no request is sent to a server.",
      howTo: [
        "Choose a preset or enter a custom value for each of the five cron fields.",
        "Watch the expression assemble itself at the top of the builder.",
        "Read the plain-English meaning to confirm the schedule matches your intent.",
        "Check the list of the next five run times, then copy the summary for your notes.",
      ],
      example:
        "Setting minute to */5 while leaving the other fields on '*' produces '*/5 * * * *', explained as 'Runs every 5 minutes', with the next five runs spaced five minutes apart from the current time.",
      benefits: [
        "Avoid memorising cron syntax with a guided field-by-field builder.",
        "Catch invalid fields before you deploy a broken scheduled job.",
        "See concrete upcoming run times so off-by-one mistakes become obvious.",
        "Custom tokens support advanced forms like ranges, steps and lists.",
        "Runs entirely in the browser, so schedules never leave your device.",
      ],
      faqs: [
        {
          q: "Which cron format does this use?",
          a: "It uses the classic five-field format: minute, hour, day of month, month, and day of week. Fields support '*', steps like '*/5', ranges like '1-5', ranges with steps like '1-10/2', and comma-separated lists. Seconds and year fields are not included.",
        },
        {
          q: "What do the next run times use as a starting point?",
          a: "They are calculated from your device's current local date and time, not from UTC. If your crontab runs in a different timezone, the displayed times may differ from your server's schedule by that offset.",
        },
        {
          q: "How are day of month and day of week combined?",
          a: "When both fields are restricted, the tool follows the common Vixie cron rule: the job runs when either field matches. When one field is '*', only the other is considered. This matches how most Linux crontabs behave.",
        },
        {
          q: "Does 7 mean Sunday in the day-of-week field?",
          a: "Yes. Both 0 and 7 are treated as Sunday, and the weekday names in the explanation follow that mapping. You can safely use whichever convention your cron implementation prefers.",
        },
        {
          q: "Why might a very rare schedule show no runs?",
          a: "The search walks roughly four years ahead. A pattern that cannot occur in that window, such as February 30th, will return no runs. Review the field values if the list is empty.",
        },
      ],
    },
  },
  {
    slug: "css-gradient-generator",
    title: "CSS Gradient Generator",
    description:
      "Design linear and radial CSS gradients with unlimited colour stops, an angle or shape control, and a live preview. Copy the finished background declaration straight into your stylesheet.",
    category: "developer",
    keywords: ["CSS gradient generator", "linear gradient generator", "radial gradient maker", "gradient CSS code", "colour stop editor", "background gradient builder"],
    icon: "Palette",
    status: "ready",
    popularity: 84,
    addedAt: "2026-11-22",
    related: ["box-shadow-generator", "color-contrast-checker", "image-format-converter"],
    content: {
      what: "The CSS Gradient Generator lets you compose a gradient visually instead of hand-writing colour stops. Add as many stops as you like, drag each to a position between 0% and 100%, and switch between linear gradients with an adjustable angle and radial gradients with a shape and focal position. The live preview updates instantly and the generated declaration is ready to copy.",
      howTo: [
        "Choose Linear or Radial as the gradient type.",
        "Set an angle for linear gradients, or a shape and position for radial ones.",
        "Add colour stops and set each colour and percentage position with the sliders.",
        "Check the live preview, then copy the CSS declaration when it looks right.",
      ],
      example:
        "Two stops at 0% (#6366f1) and 100% (#ec4899) with a 135-degree angle produce 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', a diagonal indigo-to-pink fade.",
      benefits: [
        "Design gradients visually without guessing at colour stop syntax.",
        "Support both linear and radial gradients with fine-grained controls.",
        "Stops are sorted by position so the generated CSS stays predictable.",
        "Live preview gives instant feedback before you copy any code.",
        "Accepts hex, rgb, hsl and named CSS colours in the text fields.",
      ],
      faqs: [
        {
          q: "Can I use colours other than hex?",
          a: "Yes. The colour text fields accept hex values, rgb() and rgba() functions, hsl() and hsla() functions, and standard CSS colour names. The picker itself only shows hex colours, so it falls back to black when a non-hex value is entered.",
        },
        {
          q: "What happens if I place stops out of order?",
          a: "Nothing breaks. Stops are sorted by their position before the CSS is generated, so dragging a stop past another simply reorders them in the output. Equal positions are allowed and create a hard colour edge.",
        },
        {
          q: "Does the tool generate vendor-prefixed gradients?",
          a: "No. It outputs the modern unprefixed syntax, which every current browser supports. If you need to support very old browsers, add a prefixed fallback manually in your stylesheet.",
        },
        {
          q: "How many colour stops can I add?",
          a: "There is no fixed limit. Add as many as you need for complex multi-colour blends. At least two stops are required; the tool warns you if you remove too many.",
        },
        {
          q: "Is the preview an image I can download?",
          a: "No. The preview is a live CSS-rendered element and the export is a CSS declaration, not a bitmap. Save it as a background rule in your stylesheet rather than as an image file.",
        },
      ],
    },
  },
  {
    slug: "box-shadow-generator",
    title: "Box Shadow Generator",
    description:
      "Compose layered CSS box shadows with offset, blur, spread, colour, opacity and inset controls. Preview each stack live and copy the finished declaration in one click.",
    category: "developer",
    keywords: ["box shadow generator", "CSS shadow builder", "layered box shadow", "shadow CSS generator", "inset shadow maker", "drop shadow CSS tool"],
    icon: "Scaling",
    status: "ready",
    popularity: 78,
    addedAt: "2026-11-22",
    related: ["css-gradient-generator", "color-contrast-checker", "open-graph-generator"],
    content: {
      what: "The Box Shadow Generator builds a CSS box-shadow value from one or more editable layers. Each layer has independent horizontal and vertical offsets, blur, spread, colour, opacity and an inset toggle. Layers can be muted or removed individually, and the combined effect is shown on a preview card so you can judge depth, elevation and softness before copying the CSS.",
      howTo: [
        "Adjust the offset, blur and spread sliders for the first shadow layer.",
        "Pick a colour and set its opacity to control how strong the shadow reads.",
        "Add more layers to build realistic elevation, or toggle inset for an inner shadow.",
        "Review the live preview and copy the generated box-shadow declaration.",
      ],
      example:
        "A soft elevation can be made from two layers: '0 20px rgba(15, 23, 42, 0.18)' for broad ambient depth plus '0 4px rgba(15, 23, 42, 0.12)' for a tighter contact shadow, joined into one box-shadow value.",
      benefits: [
        "Create realistic elevation with multiple stacked shadow layers.",
        "Fine-tune colour and opacity independently of geometry.",
        "Mute a layer to compare looks without losing your settings.",
        "Inset toggle makes inner shadows as easy as outer ones.",
        "Copy-ready CSS with no manual punctuation or unit mistakes.",
      ],
      faqs: [
        {
          q: "Why does my shadow look invisible?",
          a: "A layer may be disabled, set to zero blur and spread with no offset, or given very low opacity. Re-enable the layer and raise the opacity, or increase the blur, to make the effect visible on the preview card.",
        },
        {
          q: "What is the difference between blur and spread?",
          a: "Blur softens the shadow's edge, while spread grows or shrinks the shadow before blurring. Positive spread makes a larger, denser shadow; negative spread pulls it inward for a tighter effect.",
        },
        {
          q: "Can I make a shadow that glows outward in all directions?",
          a: "Yes. Set both offsets to 0, choose a bright colour, and use a moderate blur with positive spread. This produces the same technique used for neon-style glows.",
        },
        {
          q: "How does inset change the result?",
          a: "An inset shadow is drawn inside the element's padding box rather than outside its border box. It is useful for pressed buttons, wells and subtle inner highlights.",
        },
        {
          q: "Can I copy shadows for multiple elements at once?",
          a: "The tool generates a single declaration at a time. Build and copy each shadow separately, then apply them to the selectors you need in your stylesheet.",
        },
      ],
    },
  },
  {
    slug: "gitignore-generator",
    title: ".gitignore Generator",
    description:
      "Assemble a clean .gitignore file from templates for popular languages, frameworks, operating systems and editors. Combine stacks, remove duplicates and download the result instantly.",
    category: "developer",
    keywords: [".gitignore generator", "gitignore builder", "gitignore templates", "create gitignore file", "node gitignore", "python gitignore"],
    icon: "FileCode2",
    status: "ready",
    popularity: 80,
    addedAt: "2026-11-22",
    related: ["slug-generator", "mock-json-generator", "robots-generator"],
    content: {
      what: "The .gitignore Generator builds a project ignore file by combining curated rule sets for common technologies. Pick the stacks you use, such as Node.js, Python, Docker, VS Code or macOS, and the tool merges their rules into one file. Repeated patterns are removed automatically, an optional header explains the file's origin, and the finished text can be downloaded as a ready-to-commit .gitignore.",
      howTo: [
        "Select one or more stack templates from the checkbox grid.",
        "Choose whether to include the explanatory header comment.",
        "Review the combined rules in the output area and deselect anything you do not need.",
        "Download the result as .gitignore and place it in your repository root.",
      ],
      example:
        "Selecting Node.js, Next.js / React, VS Code and macOS produces a single file that ignores node_modules/, /.next/, .env*.local, .vscode/* and .DS_Store, with duplicate rules collapsed into one entry each.",
      benefits: [
        "Start a new repository with sensible ignore rules in seconds.",
        "Mix several stacks, such as a Python backend and a Docker setup.",
        "Automatic de-duplication keeps the output short and readable.",
        "Covers languages, frameworks, editors and operating systems.",
        "Downloads directly as a correctly named .gitignore file.",
      ],
      faqs: [
        {
          q: "Which templates are available?",
          a: "The generator includes Node.js, Next.js / React, Python, Java, .NET, Go, Rust, Ruby, PHP, macOS, Windows, Linux, VS Code, JetBrains IDEs and Docker. Select any combination of them.",
        },
        {
          q: "What happens when two templates share a rule?",
          a: "Duplicate ignore rules appear only once in the output. Comment lines are preserved per template so you can still see which section each rule came from.",
        },
        {
          q: "Can I edit the generated rules?",
          a: "Yes. The output area is a normal text field. Copy it to your editor, or adjust the template selection and regenerate. Treat the templates as a starting point rather than a complete policy.",
        },
        {
          q: "Why is a file still tracked after I added it to .gitignore?",
          a: "Ignore rules do not untrack files that are already in Git's index. Run 'git rm --cached <file>' for those paths, then commit the change. The new rules will apply from that point on.",
        },
        {
          q: "Does this handle negated patterns like !.vscode/settings.json?",
          a: "Yes. Negated patterns are stored as part of the templates and passed through in order. Keep negation lines after the broad rule they are meant to override.",
        },
      ],
    },
  },
  {
    slug: "mock-json-generator",
    title: "Mock JSON Data Generator",
    description:
      "Define a schema with typed fields and generate realistic-looking but clearly fake JSON rows. Set up to 100 records, control the random seed, and copy or download the result.",
    category: "developer",
    keywords: ["mock JSON generator", "fake data generator", "dummy JSON data", "test data generator", "JSON fixture generator", "schema to JSON"],
    icon: "Braces",
    status: "ready",
    popularity: 79,
    addedAt: "2026-11-22",
    related: ["json-formatter", "json-validator", "csv-to-json", "gitignore-generator"],
    content: {
      what: "The Mock JSON Data Generator turns a small schema into an array of sample records. Add fields and assign each a type such as text, number, boolean, date, email, full name, UUID, sentence or a custom enum. Choose how many rows to produce, up to 100, and optionally change the seed. A deterministic generator fills each row with plausible values that are unmistakably fake, ready for demos, UI wireframes and tests.",
      howTo: [
        "Add fields to the schema and give each a name and a type.",
        "For enum fields, list the allowed options separated by commas.",
        "Set the row count with the slider and optionally change the seed.",
        "Check the generated JSON, then copy it or download it as a .json file.",
      ],
      example:
        "A schema with 'id' as UUID, 'name' as full name, 'email' as email, 'active' as boolean and 'role' as an enum of admin, editor, viewer produces rows like {\"id\":\"...\",\"name\":\"Jordan Sample 3\",\"email\":\"user3@example.test\",\"active\":true,\"role\":\"editor\"}.",
      benefits: [
        "Populate interfaces and tests without handling real personal data.",
        "Nine field types cover the most common data shapes.",
        "A fixed seed reproduces identical rows for reliable test fixtures.",
        "Emails and names use reserved or placeholder domains and labels.",
        "Copy to the clipboard or download a well-formatted JSON file.",
      ],
      faqs: [
        {
          q: "Is the generated data safe to use publicly?",
          a: "Yes. All emails use the reserved example.test domain, names are assembled from placeholder labels, and sentences are generic. Nothing is drawn from real customer records, so the output is safe for demos and screenshots.",
        },
        {
          q: "Why is the row count capped at 100?",
          a: "The tool is designed for quick fixtures and previews, not bulk data warehousing. The cap keeps generation instant and the output readable. For larger datasets, use a dedicated seeding script in your backend.",
        },
        {
          q: "What does the seed do?",
          a: "The seed initialises the pseudo-random generator. The same schema and seed always produce the same rows, which makes snapshots and regression tests reproducible. Use the shuffle button to pick a new seed.",
        },
        {
          q: "Can I generate nested objects or arrays?",
          a: "No. Fields are flat, single-value columns. Generate separate files for related collections, or post-process the JSON in your own code if you need nested structures.",
        },
        {
          q: "What happens if two fields share a name?",
          a: "The generator stops and shows an error rather than silently overwriting a value. Rename one of the fields and the JSON will regenerate automatically.",
        },
      ],
    },
  },
];
