import { Search } from "lucide-react";
import Link from "next/link";
import { mainNav } from "@/constants/site";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="container-page relative flex h-[4.5rem] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-pill px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent-soft hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <form
            action="/tools"
            method="get"
            role="search"
            className="relative hidden w-60 xl:block"
          >
            <label htmlFor="header-search" className="sr-only">
              Search tools
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground"
              aria-hidden="true"
            />
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder="Search tools..."
              className="h-10 w-full rounded-pill border border-border/80 bg-surface-muted/70 pl-9 pr-3 text-sm placeholder:text-subtle-foreground transition-all focus-visible:border-accent focus-visible:bg-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/10"
            />
          </form>
          <Link
            href="/tools"
            className="btn-primary hidden rounded-pill px-4 py-2 text-sm font-semibold sm:inline-flex"
          >
            Explore tools
          </Link>
          <ThemeToggle />
          <MobileNav links={mainNav} />
        </div>
      </div>
    </header>
  );
}
