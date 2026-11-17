"use client";

import { ArrowLeft, Link2 } from "lucide-react";
import Link from "next/link";
import { FavoriteButton } from "@/components/search/FavoriteButton";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { copyTextToClipboard } from "@/lib/utils/clipboard";

/** Real actions only: favorite this tool and copy its page link. */
export function ToolActions({ slug, title }: { slug: string; title: string }) {
  const { toast } = useToast();

  const copyLink = async () => {
    try {
      await copyTextToClipboard(window.location.href);
      toast({ title: "Tool link copied", variant: "success" });
    } catch (cause) {
      toast({
        title: "Could not copy link",
        description: cause instanceof Error ? cause.message : "Copy the URL from your browser instead.",
        variant: "error",
      });
    }
  };

  return (
    <div className="sticky bottom-0 z-20 -mx-4 border-t border-border bg-background/90 px-4 py-3 backdrop-blur-xl sm:hidden">
      <div className="flex items-center gap-2">
        <Link
          href="/tools"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-control border border-border bg-surface"
          aria-label="Back to all tools"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
        <Button variant="outline" className="min-w-0 flex-1" onClick={copyLink}>
          <Link2 className="size-4" aria-hidden="true" />
          Copy tool link
        </Button>
        <FavoriteButton slug={slug} title={title} className="size-11 shrink-0" />
      </div>
    </div>
  );
}
