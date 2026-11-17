"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils/cn";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, mounted, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group inline-flex size-10 items-center justify-center rounded-control border border-border bg-surface text-foreground transition-all hover:border-border-strong hover:bg-surface-muted active:scale-95",
        className,
      )}
    >
      <span className="theme-icon inline-flex group-hover:rotate-12">
        {isDark ? (
          <Sun className="size-4.5" aria-hidden="true" />
        ) : (
          <Moon className="size-4.5" aria-hidden="true" />
        )}
      </span>
      <span className="sr-only" suppressHydrationWarning>
        {mounted ? (isDark ? "Light mode available" : "Dark mode available") : ""}
      </span>
    </button>
  );
}
