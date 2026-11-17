# TolaDev: Add 60 More Tools (Batches G to Q)

You are continuing work on **TolaDev** (Next.js App Router, TypeScript strict, Tailwind, Lucide React, browser-side processing first).
The registry already has 50 tools (47 `ready`, 3 `needs-api`). This file adds **60 more**: Batches G–P contain **50 tools in 10 batches of 5**, and **Batch Q adds 10 tools after Batch P**, chosen to fill the weak categories (Video & Audio, E-commerce, Language, Security, Social, Student).

---

## 0. RULES (ALWAYS FOLLOW)

1. **Read first.** Read `PROGRESS.md`, `lib/registry/tools.ts`, `types/tool.ts`, `ToolShell`, and one finished tool for the exact pattern. Reuse it. Do NOT change the architecture, design system, or registry schema.
2. **Skip duplicates.** Before each tool, check whether it (or something equivalent) already exists in the registry. If it does, skip it and take the next tool from the RESERVE LIST (section 4). Never create two tools that do the same job.
3. **One tool at a time, one batch at a time.** Finish, test, and register each tool completely. After each batch (5 tools) run the checks, report, then STOP and wait for `next` or `fix: ...`.
4. **No fake tools or results.** Everything must really work in the browser. If a tool cannot be done accurately, skip it and tell me why. Never invent data (no fake exchange rates, fake counts, fake reviews).
5. **No thin or duplicate pages.** Every tool needs original content: what it does, how to use, a real example, benefits, 4+ FAQs, valid related slugs. Do not copy text between tools.
6. **Privacy and security.** Files and text stay in the browser. Validate input, set file size limits, sanitize any rendered HTML, free object URLs, no secrets in client code.
7. **Minimal dependencies.** Prefer native APIs (Web Audio, Canvas, Intl, File API, Web Crypto). Add a library only when really needed, use a stable version, and lazy-load it.
8. **Verify.** After each tool: `npx tsc --noEmit`. After each batch: `npm run lint` and `npm run build`. Fix all errors before reporting.
9. **Update `PROGRESS.md`** after every tool.
10. Do not ask unnecessary questions. Use sensible professional defaults.

---

## 1. PER-TOOL WORKFLOW

1. Plan in 3 to 5 lines: inputs, outputs, edge cases, library (if any).
2. Put pure logic in `lib/utils/<tool>.ts` (no React) so it is easy to verify.
3. Build the UI in `components/tools/<ToolName>.tsx` with existing `Button`, `Input`, `Card`, `Toast`, `ToolShell`.
4. Register in `lib/registry/tools.ts` with full original content and `status: "ready"`.
5. Test with the checklist below and record real sample input and output.

### Quality checklist (all must pass before `ready`)
- [ ] Correct result for valid input (verify at least 2 calculations/conversions by hand)
- [ ] Friendly error for invalid input; empty input handled
- [ ] Edge cases: huge input, zero, negatives, decimals, emoji, Khmer/unicode text
- [ ] Copy / download / reset work where applicable
- [ ] Loading state, file size limit, unsupported-file message for uploads
- [ ] Mobile OK (no horizontal scroll), keyboard accessible, labelled inputs
- [ ] Light and dark mode both fine
- [ ] No type, lint, or build errors
- [ ] Unique title and meta description

---

## 2. THE 50 TOOLS

### Batch G: Video & Audio (category currently empty)
1. Video Thumbnail Extractor (pick a frame with `<video>` + Canvas, download PNG/JPG)
2. Audio Trimmer (Web Audio API, waveform preview, export WAV)
3. Audio Volume Booster (gain control, export WAV, warn about clipping)
4. Audio Speed Changer (playback rate, export processed WAV; explain pitch behavior honestly)
5. Subtitle Converter (SRT <-> VTT, handle timestamps and encodings)

### Batch H: E-commerce I
6. Product Price Calculator (cost + margin or markup to selling price)
7. Marketplace Fee Calculator (user enters fee percentages; no hardcoded "official" fees)
8. E-commerce Profit Calculator (revenue, COGS, shipping, ads, fees, returns)
9. Wholesale Price Calculator
10. Product SKU Generator (configurable pattern, bulk list, CSV download)

### Batch I: E-commerce II
11. Barcode Generator (Code128, EAN-13 with checksum validation, download PNG/SVG)
12. Shipping Cost Calculator (volumetric vs actual weight, user-entered rates)
13. Inventory Calculator (reorder point, safety stock, EOQ)
14. Return Policy Generator (template builder; show "not legal advice" note)
15. Discount Price Generator (bulk price list with percent/fixed discounts, CSV download)

### Batch J: Social Media & Creator
16. Content Calendar Generator (monthly grid, add posts, export CSV)
17. Instagram Grid Planner (upload images locally, drag to reorder, preview 3-column grid)
18. Link-in-Bio Page Generator (live preview, export a single self-contained HTML file)
19. Social Media Image Resizer (presets for common platforms, crop and download)
20. UTM Link Builder (validate URL, encode parameters, copy)

### Batch K: Security & Network
21. IP Subnet Calculator (IPv4 CIDR: network, broadcast, host range, mask)
22. User-Agent Parser (parse pasted string and the visitor's own UA)
23. Browser Information Checker (only data the browser exposes; state that nothing is sent anywhere)
24. HTTP Status Code Reference (searchable, original explanations)
25. Network Port Reference (searchable table, original descriptions)

### Batch L: Language & Accessibility
26. Color Blindness Simulator (upload image, Canvas matrices for common types)
27. NATO Phonetic Alphabet Converter
28. Morse Code Translator (text <-> Morse, optional audio playback)
29. Khmer Numeral Converter (០-៩ <-> 0-9, verified mapping only)
30. Number to Words (English; handle negatives, decimals, large numbers)

### Batch M: Student & Education
31. Scientific Calculator (correct operator precedence, no `eval`; use a safe parser)
32. Matrix Calculator (add, multiply, determinant, inverse, transpose; validate dimensions)
33. Equation Solver (linear and quadratic with steps; handle no real roots)
34. Citation Generator (APA 7 and MLA 9 from form fields; website, book, journal)
35. Study Timetable Generator (subjects, hours, days; export CSV/print)

### Batch N: Productivity & Everyday
36. Time Zone Converter (`Intl` API, handles daylight saving)
37. Meeting Time Planner (overlap of working hours across zones)
38. Sleep Cycle Calculator (90-minute cycles; not medical advice)
39. Calorie Calculator (Mifflin-St Jeor; clear "estimate only, not medical advice")
40. Water Intake Calculator (estimate only, with disclaimer)

### Batch O: Developer
41. Cron Expression Generator (builder + human-readable explanation + next 5 run times)
42. CSS Gradient Generator (linear/radial, multiple stops, copy CSS)
43. Box Shadow Generator (multiple layers, live preview, copy CSS)
44. .gitignore Generator (templates for common stacks, combine and download)
45. Mock JSON Data Generator (schema builder, random but realistic fake data, row count limit)

### Batch P: Image, PDF & Design
46. PDF Page Numbering (`pdf-lib`, position and format options)
47. PDF Watermark (`pdf-lib`, text watermark, opacity, rotation)
48. Image Color Picker (click pixel, HEX/RGB/HSL, palette from image)
49. Passport Photo Maker (crop to common sizes, print sheet; state that country rules vary and must be checked)
50. SVG to JSX (convert attributes correctly, handle `style`, `class`, `xlink`; sanitize input)

### Batch Q (after Batch P)
51. Unit Converter (length, weight, temperature, area, volume, time; original conversions, no fake factors)
52. BMI Calculator (metric/imperial, category with clear non-medical disclaimer)
53. Lorem Ipsum Generator (paragraphs/sentences/words, no server)
54. SQL Formatter (keyword casing/indentation, safe parser-free tokenizer)
55. Hash Generator (SHA-256/SHA-1 via Web Crypto, text and file input)
56. Invoice Generator (client-side form, line items, totals, print/download)
57. Word Frequency Counter (Unicode-aware, stop-word toggle, export CSV)
58. Reading Time Calculator (words per minute, Khmer-aware segmentation where available)
59. Image Rotator (90/180/270 degrees, canvas, download)
60. Favicon Generator (image or emoji to ICO/PNG sizes, preview and download)

---

## 3. EXTRA DUTIES PER BATCH

- Add **1 original blog guide** (800+ words) related to the batch, with internal links to its tools. Keep it genuinely useful, not keyword stuffing.
- Make sure no category page ends up with exactly one thin tool; update related tool links across the registry where it makes sense.
- Confirm the new tools appear in search, category pages, the sitemap, and the "recently added" list.

---

## 4. RESERVE LIST (use only to replace skipped duplicates or infeasible tools)

Break-even Calculator, Freelance Rate Calculator, Savings Goal Calculator, Working Days Calculator, HTML Entity Encoder, Sitemap Generator, Markdown to HTML, Fancy Text Generator, Password Strength Checker, Color Palette Extractor.

## 5. DO NOT BUILD IN THIS ROUND

Anything needing a server, paid API, or AI model (Currency Converter, Background Remover, Image Upscaler, Video Compressor, DNS Lookup, Website Speed Checker, AI tools, translators). Khmer Unicode legacy converter or Khmer translator unless the mapping is verified. Keep those `needs-api` or `planned`.

---

## 6. REPORT FORMAT (after each batch)

```
BATCH <letter> REPORT
Completed (ready): <tool + URL>
Skipped / replaced from reserve: <tool + reason>
Blog guide added: <title + URL>
Files created/changed: <list>
Dependencies added: <name, version, why>
Verification: tsc <pass/fail>, lint <pass/fail>, build <pass/fail>
Sample tests (tool: input -> expected -> actual): <at least 1 per tool>
Registry totals: ready / needs-api / planned
Known issues: <honest list>
Waiting for: "next" or "fix: ..."
```

---

## START NOW

1. Read the files listed in Rule 1.
2. Reply with a 5-line summary of the current registry (counts per category) and confirm that you will start with Batch G.
3. Build **Batch G, Tool 1 only**, test it, report, then STOP and wait for me to say `next`.
