import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import type { CategoryId } from "@/types/category";

export type BadgeVariant = "neutral" | "accent" | "success" | "warning" | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Tints the chip with the matching category accent. */
  category?: CategoryId;
  /** Shows a small category/status dot before the label. */
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  neutral: "chip-neutral",
  accent: "",
  success: "chip-success",
  warning: "chip-warning",
  danger: "chip-danger",
};

/** Small label chip used for categories and real tool statuses. */
export function Badge({
  variant = "neutral",
  category,
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-category={category}
      className={cn("chip", variants[variant], className)}
      {...props}
    >
      {dot ? (
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            category ? "cat-dot" : "bg-current",
          )}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </span>
  );
}
