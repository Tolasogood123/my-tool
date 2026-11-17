"use client";

import { Copy, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import { downloadText } from "@/lib/utils/download";
import { cn } from "@/lib/utils/cn";

interface ToolOutputProps {
  label: string;
  value: string;
  placeholder?: string;
  /** When set, a Download button is shown using this filename. */
  filename?: string;
  mimeType?: string;
  rows?: number;
  onClear?: () => void;
  className?: string;
  /** Show as a read-only result area (default). */
  editable?: boolean;
  onChange?: (value: string) => void;
}

export function ToolOutput({
  label,
  value,
  placeholder,
  filename,
  mimeType,
  rows = 8,
  onClear,
  className,
  editable = false,
  onChange,
}: ToolOutputProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await copyTextToClipboard(value);
      toast({ title: "Copied to clipboard", variant: "success" });
    } catch (error) {
      toast({
        title: "Could not copy",
        description: error instanceof Error ? error.message : "Try selecting the text manually.",
        variant: "error",
      });
    }
  };

  const handleDownload = () => {
    if (!filename) return;
    downloadText(value, filename, mimeType);
    toast({ title: "Download started", description: filename, variant: "success" });
  };

  const id = `output-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="tool-actions sticky top-[5.5rem] z-10 -mx-2 flex flex-wrap items-center justify-between gap-2 rounded-control bg-surface/95 px-2 py-2 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:p-0">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            disabled={!value}
          >
            <Copy className="size-3.5" aria-hidden="true" />
            Copy
          </Button>
          {filename ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleDownload}
              disabled={!value}
            >
              <Download className="size-3.5" aria-hidden="true" />
              Download
            </Button>
          ) : null}
          {onClear ? (
            <Button type="button" size="sm" variant="ghost" onClick={onClear}>
              <Trash2 className="size-3.5" aria-hidden="true" />
              Clear
            </Button>
          ) : null}
        </div>
      </div>
      <Textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder ?? "Your result will appear here."}
        readOnly={!editable}
        onChange={editable && onChange ? (event) => onChange(event.target.value) : undefined}
        className="font-mono text-xs leading-6"
      />
    </div>
  );
}
