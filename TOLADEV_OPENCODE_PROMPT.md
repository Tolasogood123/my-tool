# TolaDev: Step-by-Step Build Instructions for OpenCode

You are a senior full-stack engineer, UI/UX designer, and SEO specialist.
You are building **TolaDev**, a free, worldwide, all-in-one online tools platform.

- Tagline: **Free Tools. Smarter Work. Anywhere.**
- Audience: students, developers, freelancers, creators, business owners, office workers.
- Language: English now, Khmer and others later.
- Money: free tools + Google AdSense (later). Optional premium AI + affiliate (later).

---

## 0. HOW YOU MUST WORK (READ FIRST, FOLLOW ALWAYS)

1. **Work in ONE step at a time.** Do only the step I name. Never jump ahead.
2. **After each step, STOP.** Print a short report and wait for me to say `next` or `fix: ...`.
3. **Inspect before changing.** Read the existing files first. Do not delete or overwrite working code without a reason.
4. **Verify every step.** Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`. Fix all errors before reporting. If you cannot run a command, say so honestly.
5. **No fake features.** Never create a tool that only shows a title and a button. Never show fake results. If a tool needs an external API, build the UI, mark it `needs-api`, and say clearly that it is not working yet.
6. **No TODO placeholders** for anything you call "done".
7. **Complete code only.** No pseudocode, no "rest of the code here".
8. **Reuse components.** Do not duplicate code. Keep design consistent.
9. **Use stable package versions.** Check `package.json` before adding dependencies. Prefer fewer dependencies.
10. **Explain simply.** Give short, beginner-friendly notes on important decisions and commands.
11. **Track progress** in `PROGRESS.md` at the project root (create it in Step 1.1). Update it after every step.
12. Do not ask unnecessary questions. Use sensible professional defaults. Ask only if truly blocked.

### Report format after every step

```
STEP <id> DONE
Files created/changed: <list>
Commands run + result: <lint / tsc / build>
How to check it manually: <what I should open or click>
Known issues / remaining: <honest list>
Waiting for: "next"
```

---

## 1. TECH STACK

- Next.js (App Router), TypeScript (strict), React, Tailwind CSS, Lucide React.
- Client-side processing whenever possible (privacy + low server cost).
- No database unless there is a real requirement.
- Secrets only in `.env.local`, never in client code. Never commit `.env*`.
- Note: new `create-next-app` may use **Tailwind v4** (theme in `globals.css` with `@theme`, possibly no `tailwind.config.ts`). Follow whatever version actually gets installed. Do not mix v3 and v4 syntax.

## 2. TARGET FOLDER STRUCTURE

```
app/
  layout.tsx, page.tsx, globals.css, sitemap.ts, robots.ts
  tools/page.tsx                  # All Tools
  tools/[slug]/page.tsx           # one dedicated URL per tool
  category/[category]/page.tsx
  blog/, about/, contact/
  privacy-policy/, terms-of-service/, disclaimer/
components/
  ui/        # Button, Input, Card, Modal, Dropdown, Toast, Skeleton, EmptyState, ErrorState
  layout/    # Header, Footer, MobileNav, ThemeToggle, Breadcrumbs
  home/      # Hero, PopularTools, CategoryGrid, RecentTools, FeaturedAI, WhyChoose, HowItWorks, FAQ, LatestGuides
  search/    # ToolSearch, FavoriteButton
  tool/      # ToolShell, ToolContent, RelatedTools, AdSlot
  tools/     # one component per tool
lib/
  registry/  # tools.ts, categories.ts, helpers.ts (search, related, filter, sort)
  seo/       # metadata.ts, jsonld.ts
  utils/     # file validation, clipboard, download, formatters
hooks/       # useFavorites, useCopy, useDebounce, useTheme
types/       # tool.ts, category.ts
constants/   # site config, ad slots, file size limits
public/
```

Key rules:
- `app/tools/[slug]/page.tsx` reads the registry and loads the tool UI with `next/dynamic` (code splitting).
- Tool pages are Server Components for SEO. Interactive parts are Client Components.
- Favorites use `localStorage`. Always wrap in try/catch and handle SSR.

## 3. REGISTRY SCHEMA

```ts
export type ToolStatus = "ready" | "needs-api" | "planned";

export interface Tool {
  slug: string;
  title: string;
  description: string;      // unique meta description
  category: CategoryId;
  keywords: string[];
  icon: string;             // Lucide icon name
  status: ToolStatus;
  popularity: number;
  addedAt: string;          // ISO date
  related: string[];        // slugs
  content: {
    what: string;
    howTo: string[];
    example: string;
    benefits: string[];
    faqs: { q: string; a: string }[];
  };
}
```

- `planned` tools must NOT appear in search, sitemap, or generate pages (avoid thin pages).
- `needs-api` tools show a clear notice explaining which service is required.

## 4. CATEGORIES (13)

AI & Writing, PDF & Documents, Image & Design, Developer, Student & Education,
Business & Finance, Web & SEO, Video & Audio, Productivity, E-commerce,
Social Media & Creator, Security & Privacy, Language & Accessibility.

---

## 5. DESIGN SYSTEM

- Minimalist premium SaaS look: clean typography, generous spacing, rounded cards, subtle shadows, smooth (not excessive) animation, clear hierarchy. Must NOT look like a generic AI template.
- Light + dark mode, with no flash on load. Mobile, tablet, desktop responsive.
- Accessible: semantic HTML, focus states, labels, keyboard support, good contrast.
- Pick ONE accent color, a neutral palette, and ONE font pair. Define them as design tokens.

---

# PHASE 1: FOUNDATION (do each step separately)

### Step 1.1 Project setup
Inspect the folder. If no Next.js project exists, initialize one (TypeScript, Tailwind, ESLint, App Router, `@/*` alias). Install `lucide-react`. Create `PROGRESS.md` listing all steps below with checkboxes. Create the empty folder structure. Confirm `npm run dev` and `npm run build` work.

### Step 1.2 Design tokens and theme
Colors, fonts (`next/font`), radius, shadows, spacing in `globals.css`. Dark/light mode with `ThemeToggle` and no flash. Build a temporary `/design` page to preview tokens.

### Step 1.3 UI components
Button (variants, sizes, loading), Input/Textarea/Select, Card, Modal, Dropdown, Toast (provider + hook), Skeleton, EmptyState, ErrorState. Show all of them on `/design`.

### Step 1.4 Layout
Header (logo, nav, search entry, theme toggle), MobileNav, Footer (all important links), Breadcrumbs. Wire into `layout.tsx`. Test on a narrow screen.

### Step 1.5 Registry
Types, `categories.ts`, `tools.ts`, helpers (`searchTools`, `getRelated`, `filterByCategory`, `sortBy`). Add the 15 Phase 2 tools as metadata with full `content` (what / how-to / example / benefits / FAQs) written originally, not copy-pasted. Mark them `planned` until their UI exists. Add a small test or script that validates the registry (unique slugs, valid related slugs).

### Step 1.6 Search and favorites
`ToolSearch` with debounce: search by name and keyword, filter by category, sort by popularity and A-Z, no-results state. `useFavorites` with `localStorage` and `FavoriteButton`.

### Step 1.7 Homepage
Sections in order: header, hero ("Everything You Need. One Place." + subtitle "Discover free online tools that help you work smarter, create faster, and get more done."), large search bar, popular tools, browse by category, recently added, featured AI tools, why choose TolaDev, how it works, FAQ, latest guides, footer. CTAs: "Explore All Tools", "Discover Popular Tools". Only show tools that actually exist (`ready` or `needs-api`).

### Step 1.8 All Tools and category pages
`/tools` with search, filters, sorting. `/category/[category]` for every category with a proper intro paragraph. Handle empty categories honestly ("tools coming soon") without fake cards.

### Step 1.9 SEO base and legal pages
`lib/seo/metadata.ts` (title, description, canonical, Open Graph, Twitter). `sitemap.ts` and `robots.ts` generated from the registry. JSON-LD helper. Create About, Contact, Blog (index + 1 real guide), Privacy Policy, Terms of Service, Disclaimer with real, useful content (not lorem ipsum). Add an `AdSlot` component that renders nothing unless a publisher ID is set in env. **No fake AdSense code.**

### Phase 1 checkpoint
Run lint, tsc, build. Check mobile layout and both themes. Update `PROGRESS.md`. Stop and wait for my approval before Phase 2.

---

# PHASE 2: 15 PRIORITY TOOLS (ONE TOOL PER STEP)

Build in this order. For each tool, make the dedicated page work at `/tools/<slug>`, then set its registry status to `ready`.

1. Image Compressor
2. Image Resizer
3. QR Code Generator
4. JSON Formatter
5. JSON Validator
6. Base64 Encoder / Decoder
7. URL Encoder / Decoder
8. Word Counter
9. Text Case Converter
10. Percentage Calculator
11. Age Calculator
12. GPA Calculator
13. Password Generator (use `crypto.getRandomValues`, never `Math.random`)
14. UUID Generator (use `crypto.randomUUID`)
15. Markdown Editor (sanitize rendered HTML)

### Requirements for EVERY tool
- Validates input, shows clear error messages, handles empty input.
- Real processing in the browser, real results.
- Copy button and/or download button where it makes sense.
- Clear/Reset button.
- Loading state for heavy work. File size limit and file type check for uploads.
- Works on mobile. Keyboard accessible.
- Uses `ToolShell` with description, how-to, example, benefits, FAQs, related tools.
- Does not upload user files anywhere.

### Testing checklist (report results for each tool)
Valid input, invalid input, empty input, edge cases (very large, special characters, unicode/Khmer text), mobile layout, copy, download, calculation accuracy (show 2 to 3 sample calculations checked by hand), no TypeScript or build errors.

Only mark a tool done in `PROGRESS.md` after this checklist passes.

---

# LATER PHASES (do NOT start until I say so)

- Phase 3: PDF, Student, Business, SEO, Social, Productivity tools.
- Phase 4: AI tools with secure server-side API routes, rate limiting, usage limits, and keys only in env variables.
- Phase 5: SEO, accessibility, performance, security audit, deployment (Vercel).

Tools that need a server or external service (Background Remover, Website Speed Checker, DNS Lookup, Video Compressor, AI tools, etc.) must be marked `needs-api` and must never show fake output.

---

## PERFORMANCE AND SECURITY RULES

- Lazy-load heavy components and libraries. Avoid unnecessary client JavaScript.
- Optimize images with `next/image`.
- Validate and sanitize all input. Never use `dangerouslySetInnerHTML` with unsanitized content.
- Sensible file size limits and unsupported-file handling.
- Do not store user files. Secure defaults. Never expose secrets.

---

## START NOW

Read this whole file. Then reply with a 5-line summary of what you understood and which step you will do first.
Then do **only Step 1.1**, verify it, send the report, and **STOP and wait for me to say `next`**.
