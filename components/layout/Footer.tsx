import Link from "next/link";
import { SITE, footerLinks } from "@/constants/site";
import { categories } from "@/lib/registry/categories";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

async function getCurrentYear(): Promise<number> {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await getCurrentYear();

  return (
    <footer className="relative overflow-hidden border-t border-border/70 bg-surface/70">
      <div className="gradient-rule absolute inset-x-0 top-0" aria-hidden="true" />
      <div className="container-page relative py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              {SITE.tagline} Free online tools that respect your privacy and run
              in your browser whenever possible.
            </p>
            <p className="mt-4 inline-flex rounded-pill border border-accent/20 bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent-soft-foreground">
              No sign-up. No uploads. No nonsense.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-subtle-foreground">
                Tools by category
              </h2>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-1">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/category/${category.id}`}
                      className="inline-block rounded-control px-1.5 py-0.5 text-sm text-muted-foreground transition-all hover:bg-accent-soft hover:text-accent"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {footerLinks.slice(1).map((group) => (
              <div key={group.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-subtle-foreground">
                  {group.title}
                </h2>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block rounded-control px-1.5 py-0.5 text-sm text-muted-foreground transition-all hover:bg-accent-soft hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-subtle-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
            Your files and text stay on your device.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
