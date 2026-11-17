import { ArrowRight, Check, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const quickLinks = [
  { label: "Image Compressor", href: "/tools/image-compressor" },
  { label: "JSON Formatter", href: "/tools/json-formatter" },
  { label: "Word Counter", href: "/tools/word-counter" },
  { label: "Password Generator", href: "/tools/password-generator" },
];

const trustPoints = ["No sign-up", "Files stay on your device", "Free forever"];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="aurora" aria-hidden="true" />
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="gradient-rule absolute inset-x-0 top-0" aria-hidden="true" />

      <div className="container-page relative py-24 sm:py-30 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <span className="glass-panel fade-up inline-flex items-center gap-2 rounded-pill px-4 py-1.5 text-xs font-semibold text-accent-soft-foreground">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Free tools for everyone, everywhere
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          </span>

          <h1 className="fade-up mt-8 text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-7xl">
            Everything You Need.
            <span className="text-gradient block pb-1">One Place.</span>
          </h1>

          <p className="fade-up mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-xl">
            Discover free online tools that help you work smarter, create faster,
            and get more done. No account. No uploads. No limits.
          </p>

          <form
            action="/tools"
            method="get"
            role="search"
            className="glass-panel fade-up mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-2xl p-2 shadow-pop"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search tools
            </label>
            <Search
              className="ml-3 size-5 shrink-0 text-accent"
              aria-hidden="true"
            />
            <input
              id="hero-search"
              name="q"
              type="search"
              placeholder="What do you need to do today?"
              className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm outline-none placeholder:text-subtle-foreground sm:text-base"
            />
            <Button type="submit" size="lg" className="shrink-0 rounded-pill px-6">
              Search
            </Button>
          </form>

          <div className="fade-up mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-subtle-foreground">Popular:</span>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-1 rounded-pill border border-border/80 bg-surface/70 px-3 py-1.5 font-medium backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent-soft hover:text-accent"
              >
                {link.label}
                <ArrowRight
                  className="size-3 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>

          <div className="fade-up mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {trustPoints.map((point, index) => (
              <span key={point} className="inline-flex items-center gap-2">
                {index > 0 ? (
                  <span className="size-1 rounded-full bg-border-strong" aria-hidden="true" />
                ) : null}
                <Check className="size-4 text-accent" aria-hidden="true" />
                {point}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
