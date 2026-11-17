"use client";

import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";

const QuickSearchPalette = dynamic(
  () => import("@/components/layout/QuickSearchPalette").then((m) => m.QuickSearchPalette),
  { ssr: false },
);

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

/** Global keyboard shortcuts: "/" focuses header search, Ctrl/Cmd+K opens palette. */
export function QuickSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        return;
      }
      if (event.key === "/" && !isTypingTarget(event.target)) {
        event.preventDefault();
        document.getElementById("header-search")?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open quick search"
        title="Quick search (Ctrl+K)"
        className="inline-flex h-11 items-center gap-2 rounded-control border border-border bg-surface px-3 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:bg-surface-muted"
      >
        <Search className="size-4" aria-hidden="true" />
        <kbd className="hidden rounded-[0.4rem] border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold sm:inline">
          /
        </kbd>
      </button>

      <Modal
        open={open}
        onClose={close}
        title="Quick search"
        description="Search every published tool by name or keyword."
      >
        {open ? <QuickSearchPalette onSelect={close} /> : null}
      </Modal>
    </>
  );
}
