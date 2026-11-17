import Link from "next/link";
import { SITE } from "@/constants/site";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const split = Math.min(4, SITE.name.length);

  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className ?? ""}`}
      aria-label={`${SITE.name} home`}
    >
      <span className="relative flex size-10 items-center justify-center rounded-[0.9rem] bg-linear-to-br from-accent to-accent-2 text-accent-foreground shadow-[0_10px_24px_-10px_var(--accent)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3">
        <span className="font-mono text-lg font-bold leading-none">T</span>
        <span className="absolute right-1.5 top-1.5 size-1 rounded-full bg-accent-foreground/70" />
      </span>
      <span className="flex flex-col">
        <span className="text-[18px] font-bold leading-tight tracking-tight">
          {SITE.name.slice(0, split)}
          <span className="text-gradient">{SITE.name.slice(split)}</span>
        </span>
        <span className="hidden text-[11px] leading-tight text-subtle-foreground sm:block">
          Free tools, smarter work
        </span>
      </span>
    </Link>
  );
}
