"use client";

import { useEffect } from "react";
import { useRecentlyUsed } from "@/hooks/useRecentlyUsed";

/** Records a tool visit locally so the homepage "Recently used" row can show it. */
export function RecordRecentTool({ slug }: { slug: string }) {
  const { recordTool } = useRecentlyUsed();

  useEffect(() => {
    recordTool(slug);
  }, [slug, recordTool]);

  return null;
}
