import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils/cn";

const base =
  "control w-full rounded-control border border-border bg-surface text-sm text-foreground placeholder:text-subtle-foreground disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger";

export function Input({
  className,
  type = "text",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input type={type} className={cn("h-10 px-3", base, className)} {...props} />
  );
}

export function Textarea({
  className,
  rows = 8,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      className={cn("min-h-28 px-3 py-2 leading-6", base, className)}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn("h-10 px-3 pr-8", base, className)}
      {...props}
    >
      {children}
    </select>
  );
}
