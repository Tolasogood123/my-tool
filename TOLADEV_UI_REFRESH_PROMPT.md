# TolaDev: UI/UX Visual Refresh (make it more attractive)

You are a senior product designer + front-end engineer improving the **look and feel** of **TolaDev** (Next.js App Router, TypeScript, Tailwind, Lucide React).
This is a **visual and UX upgrade only**. Do NOT remove or break any working tool, route, registry entry, SEO metadata, sitemap, or legal page.

---

## 0. RULES

1. Work in **stages**. After each stage run `npx tsc --noEmit`, `npm run lint`, `npm run build`, report, then STOP and wait for `next` or `fix: ...`.
2. Keep the existing brand: name TolaDev, purple accent, tagline "Free tools, smarter work". You may refine the palette, but keep it recognisably the same brand.
3. Reuse existing components (`Button`, `Card`, `ToolShell`, etc.). Improve them in place instead of creating duplicates.
4. No fake numbers, fake reviews, fake "users online", fake ratings. Only show counts computed from the real registry.
5. Light AND dark mode must both look good. Mobile first. No horizontal scroll.
6. Performance: no heavy animation libraries, no large images. Prefer CSS. Respect `prefers-reduced-motion`.
7. Accessibility: keep contrast AA, visible focus rings, semantic HTML, labels on all controls.
8. Ads: never place anything that looks like a button or a tool control near ad slots. Keep `AdSlot` rendering nothing without a publisher ID.
9. Do not change tool logic, registry schema, or URLs.

---

## 1. WHAT I SEE NOW (current state of /tools)

- Clean header with logo, nav, search, "Explore tools" button, dark-mode toggle. Good base.
- The page title area is a big block of grey text with empty space on the right.
- All 50 cards look identical: same lavender icon tile, same grey text, no visual difference between categories.
- Descriptions are cut with "..." which hides useful information.
- Nothing tells visitors why TolaDev is different (private, runs in browser, free, no sign-up).
- No quick category chips, no sticky filter bar, no "recently used" or "favorites" shortcut.
- Hero/home likely needs the same level of polish.

---

## 2. DESIGN DIRECTION

**Feel:** modern, friendly, trustworthy productivity platform. Think "clean SaaS toolbox", not a template.

- **Color:** keep purple as the primary. Give each of the 13 categories its own soft accent color (icon tile background + tiny dot/label), defined as design tokens, with matching dark-mode values.
- **Typography:** stronger hierarchy. Large confident headings, shorter intro text (max 2 lines), better line height. Keep the current font unless it clearly hurts readability.
- **Cards:** subtle border, soft shadow, gentle hover lift (translateY -2px + shadow), smooth focus ring. Show a small badge row: `Runs in browser`, `No upload`, `Free`, or `Needs API` (real, from registry status).
- **Background:** very soft gradient/mesh or subtle dot grid behind hero areas. Keep it light and fast (CSS only).
- **Spacing:** generous, consistent 8px scale. Wider max-width container for the grid on large screens.
- **Icons:** keep Lucide, consistent stroke width and size.
- **Motion:** small fade/slide-in on cards, button press feedback, theme-toggle transition. All disabled for reduced-motion users.

---

## 3. STAGES

### Stage 1: Design tokens and base components
- Add category accent colors, refined neutrals, radius, shadow, and focus tokens (light + dark).
- Upgrade `Card`, `Button`, badges/chips, inputs, and the theme toggle.
- Show them on `/design` (or the existing preview page) for review.

### Stage 2: Header and footer
- Sticky header with subtle blur and bottom border on scroll.
- Search with a keyboard hint (`/` focuses search; `Ctrl+K` opens a quick search palette listing real tools).
- Footer with grouped links (Tools by category, Company, Legal), short privacy promise, theme toggle. No fake social links.

### Stage 3: Homepage
Order of sections:
1. **Hero:** strong headline, 1-line subtitle, big search bar, 2 CTAs, and a small trust strip: "Runs in your browser", "No sign-up", "Your files never leave your device" (only keep claims that are true for the tools shown).
2. **Live stats strip:** total tools, categories, "browser-based" count, all computed from the registry.
3. **Popular tools** (by registry popularity).
4. **Browse by category:** colorful category cards with icon, name, tool count.
5. **Recently added.**
6. **Why TolaDev** (3 to 4 honest benefits), **How it works** (3 steps), **FAQ** (accordion), **Latest guides** (from blog).
7. Optional: **Recently used** and **Favorites** rows (from `localStorage`, hidden when empty).

### Stage 4: All Tools page and category pages
- Compact page header: title, short 1 to 2 line intro, live count.
- **Sticky filter bar:** search, category select, sort select, and a horizontally scrollable row of category chips with counts.
- Grid: 1 column mobile, 2 tablet, 3 to 4 desktop. Cards show icon tile in category color, title, 2-line clamped description, category label, status badges, favorite heart.
- Better empty state when no results (clear filters button + suggestions).
- Category pages: colored header band with icon, intro paragraph, tool count, related categories.

### Stage 5: Tool page template (`ToolShell`)
- Clear title row: icon, name, short description, badges, favorite button, breadcrumb.
- Main tool card with comfortable padding; sticky action bar on mobile for primary actions (Copy / Download / Reset) when it fits the tool.
- Below: "How to use", "Example", "Benefits", "FAQ" as clean sections (FAQ as accordion), then **Related tools** cards.
- Reserve configurable ad slots in safe positions only (below the tool, between content sections), never inside the tool controls.
- Add "Add to favorites" and remember **recently used** tools in `localStorage`.

### Stage 6: Polish and QA
- Skeleton loading for heavy tool components.
- Consistent toasts for copy/download/error.
- Dark mode review of every page type.
- Lighthouse-style check (report estimated issues): contrast, tap target size (44px), CLS, image sizes.
- Test on 360px, 768px, 1280px, 1920px widths.
- Update `PROGRESS.md` and list any follow-up ideas.

---

## 4. QUALITY CHECKLIST (each stage)

- [ ] Looks good in light and dark mode
- [ ] No layout shift or horizontal scroll on mobile
- [ ] Keyboard navigation and focus rings work
- [ ] No console errors or hydration warnings
- [ ] Existing tools, routes, sitemap, and metadata still work
- [ ] tsc, lint, and build pass

---

## 5. REPORT FORMAT

```
STAGE <n> REPORT
What changed visually: <short list>
Files created/changed: <list>
How to check it: <pages to open, sizes to test>
Verification: tsc <pass/fail>, lint <pass/fail>, build <pass/fail>
Known issues / ideas: <honest list>
Waiting for: "next" or "fix: ..."
```

---

## START NOW

Do **Stage 1 only**. First read the current `globals.css`, `components/ui/*`, `components/tool/ToolShell.tsx`, and the All Tools page so you keep the existing structure. Then implement Stage 1, report, and STOP.
