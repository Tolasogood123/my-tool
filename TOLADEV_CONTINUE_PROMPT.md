# TolaDev: Audit, Sync, then Continue Development

You are continuing work on **TolaDev** (Next.js App Router, TypeScript strict, Tailwind, Lucide React, browser-side processing first).
Phase 1 (foundation) and Phase 2 (15 priority tools) are believed to be finished.
**Do NOT redo them.** First find out the real state of the project, then continue.

---

## RULES

1. Work in small stages. After each stage, print a report and STOP until I say `next` or `fix: ...`.
2. Never overwrite working code without a reason. Never redesign the architecture, design system, or registry schema without asking me.
3. No fake tools. No fake results. Tools that need an external API or server are `needs-api` with an honest notice. Unfinished tools stay `planned` (hidden from search and sitemap).
4. Every tool needs original content (what it does, how to use, example, benefits, 4+ FAQs, related tools). No thin or duplicate pages.
5. Privacy: files and text stay in the browser. Validate and sanitize input. No secrets in client code.
6. Run `npx tsc --noEmit`, `npm run lint`, and `npm run build` after every stage. Fix errors before reporting. If you cannot run something, say so.
7. Keep `PROGRESS.md` accurate after every stage.
8. Do not ask unnecessary questions. Use sensible defaults.

---

## STAGE 1: AUDIT (do this first, change nothing yet)

Read the project and report honestly:

1. List every tool in `lib/registry/tools.ts` with its `status`.
2. For each tool marked `ready`, check that:
   - the page `/tools/<slug>` has a real component (not a stub),
   - input validation, copy/download/reset exist where they should,
   - the registry content is complete (what, howTo, example, benefits, 4+ FAQs, valid `related` slugs).
3. Run `tsc`, `lint`, `build` and report the results.
4. Check these site-wide items and mark each OK / MISSING / BROKEN:
   - Homepage sections, search, filters, favorites
   - Category pages, All Tools page
   - Dark/light mode, mobile layout
   - `sitemap.xml`, `robots.txt`, metadata, canonical, Open Graph, JSON-LD
   - About, Contact, Blog (at least 1 real article), Privacy Policy, Terms, Disclaimer
   - `AdSlot` renders nothing without a publisher ID
5. Compare `PROGRESS.md` with reality and list every mismatch.

Output the audit as a table plus a short list of problems ranked by importance. Then STOP and wait for me.

---

## STAGE 2: FIX AND SYNC (after I approve)

1. Fix every BROKEN item and every failing build/lint/type error.
2. Downgrade any tool that is not truly working to `planned` or `needs-api`.
3. Rewrite `PROGRESS.md` so it matches reality exactly (tool list with status, date, notes, known issues).
4. Report and STOP.

---

## STAGE 3: CONTINUE BUILDING TOOLS (3 tools per round)

Pick the next tools in this order, skipping anything already `ready`:

**Round 1:** Text Diff Checker, Regex Tester, Unix Timestamp Converter
**Round 2:** CSV to JSON, JSON to CSV, JWT Decoder (decode only; say clearly it does not verify signatures)
**Round 3:** CGPA Calculator, Grade Calculator, Pomodoro Timer
**Round 4:** Discount Calculator, VAT Calculator, Profit Margin Calculator
**Round 5:** Loan Calculator, Compound Interest Calculator, Tip / Split Bill Calculator
**Round 6:** Image to WebP/PNG/JPG, Image Cropper, EXIF Remover
**Round 7:** PDF Merge, PDF Split, JPG to PDF (`pdf-lib`, lazy-loaded, file size limits)
**Round 8:** Open Graph Generator, Robots.txt Generator, Schema Markup Generator
**Round 9:** Color Contrast Checker, Readability Score, Social Media Character Counter

### Per-tool workflow
1. Plan in 3 to 5 lines (inputs, outputs, edge cases, library if any).
2. Put the pure logic in `lib/utils/<tool>.ts`.
3. Build the UI in `components/tools/<ToolName>.tsx` using existing `Button`, `Input`, `Card`, `Toast`, `ToolShell`.
4. Register it in the registry with full original content and `status: "ready"`.
5. Test and show real sample input and output.

### Quality checklist (all must pass before `ready`)
- [ ] Correct result for valid input (verify at least 2 calculations by hand)
- [ ] Clear friendly error for invalid input; empty input handled
- [ ] Edge cases: huge input, zero, negatives, decimals, emoji, Khmer/unicode text
- [ ] Copy, download, reset work where applicable
- [ ] Loading state, file size limit, unsupported file message for uploads
- [ ] Mobile OK (no horizontal scroll), keyboard accessible, labelled inputs
- [ ] Light and dark mode look right
- [ ] No type, lint, or build errors

Do NOT build: Currency Converter, Background Remover, Image Upscaler, Video tools, AI tools, or Khmer Unicode Converter / Translator in this stage. Mark them `needs-api` or `planned`.

---

## REPORT FORMAT (after every stage or round)

```
STAGE/ROUND <id> REPORT
Done: <tools or fixes, with URLs>
Skipped / marked needs-api or planned: <list + reason>
Files created/changed: <list>
Dependencies added: <name, version, why>
Verification: tsc <pass/fail>, lint <pass/fail>, build <pass/fail>
Sample tests (tool: input -> expected -> actual)
Known issues: <honest list>
Waiting for: "next" or "fix: ..."
```

---

## START NOW

Do **Stage 1 only**. Reply with the audit table and the ranked problem list, then STOP.
