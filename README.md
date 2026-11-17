# TolaDev

Free Tools. Smarter Work. Anywhere.

A free, worldwide, all-in-one online tools platform. Tools run in the browser whenever possible, so files and text stay on the user's device. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, and Lucide icons.

## Commands

```bash
npm run dev          # development server at http://localhost:3000
npm run build        # production build
npm start            # serve the production build
npm run lint         # ESLint
npx tsc --noEmit     # TypeScript check
npm run check:registry  # validate tool slugs, categories and relations
```

## Environment variables

Create `.env.local` in the project root to set any of these. **Never commit `.env.local` or any file containing real keys.**

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used in metadata, sitemap and robots | `https://toladev.com` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense publisher ID, e.g. `ca-pub-...` | unset (no ad code is rendered) |
| `OPENAI_API_KEY` | Server-side key for the three AI tools | unset (AI tools show a clear "not working yet" notice) |
| `OPENAI_MODEL` | Model name for chat completions | `gpt-4o-mini` |
| `OPENAI_BASE_URL` | OpenAI-compatible API base URL | `https://api.openai.com/v1` |
| `AI_RATE_LIMIT_PER_HOUR` | Requests per IP per hour for `/api/ai` | `10` |

The AI key is only read in `app/api/ai/route.ts` (server-side). It is never exposed to the browser. Rate limiting in that route is per server process; use a shared store before scaling to multiple instances.

## Project layout

- `app/tools/[slug]` — dedicated page per tool, with SEO content and a code-split interactive tool.
- `lib/registry/` — tool and category metadata. Only `ready` and `needs-api` tools are published; `planned` tools never generate pages or sitemap entries.
- `components/tools/` — one React component per tool.
- `components/tool/` — shared tool shell, loader, ad slot and API notice.
- `lib/seo/` — metadata and JSON-LD helpers.

## Security and deployment notes

- All responses include `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy` and HSTS. A strict CSP is intentionally not set because the no-flash theme script and JSON-LD need inline scripts; adding nonces is a future hardening task.
- The AI route applies per-IP rate limiting with an in-memory store. Use a shared store before scaling to multiple server instances.
- `.env*` files are gitignored. Never commit real keys.
- Markdown previews use `rehype-sanitize`; JSON-LD escapes `<`; tool inputs are validated client- and server-side.
- To deploy: push the repository to Vercel, set the environment variables from the table above in Project Settings, then deploy. Verify with `npm run build` locally first.

## Deployment

The easiest deployment is Vercel. Set the environment variables above in the project settings, then run `npm run build` to verify before deploying.
