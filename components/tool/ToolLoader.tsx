"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

function ToolLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-2" aria-label="Loading tool">
      <Skeleton className="h-80" />
      <Skeleton className="h-80" />
    </div>
  );
}

function load<P extends object>(loader: () => Promise<{ default: ComponentType<P> }>) {
  return dynamic(loader, { ssr: false, loading: () => <ToolLoading /> });
}

/**
 * Code-split tool UIs. The server page handles SEO content while each
 * interactive tool is downloaded only when its own page is opened.
 */
const toolComponents: Record<string, ComponentType> = {
  "image-compressor": load(() =>
    import("@/components/tools/ImageCompressor").then((m) => ({
      default: m.ImageCompressor,
    })),
  ),
  "image-resizer": load(() =>
    import("@/components/tools/ImageResizer").then((m) => ({
      default: m.ImageResizer,
    })),
  ),
  "qr-code-generator": load(() =>
    import("@/components/tools/QrCodeGenerator").then((m) => ({
      default: m.QrCodeGenerator,
    })),
  ),
  "json-formatter": load(() =>
    import("@/components/tools/JsonFormatter").then((m) => ({
      default: m.JsonFormatter,
    })),
  ),
  "json-validator": load(() =>
    import("@/components/tools/JsonValidator").then((m) => ({
      default: m.JsonValidator,
    })),
  ),
  "base64-encoder-decoder": load(() =>
    import("@/components/tools/Base64Tool").then((m) => ({
      default: m.Base64Tool,
    })),
  ),
  "url-encoder-decoder": load(() =>
    import("@/components/tools/UrlEncoderDecoder").then((m) => ({
      default: m.UrlEncoderDecoder,
    })),
  ),
  "word-counter": load(() =>
    import("@/components/tools/WordCounter").then((m) => ({
      default: m.WordCounter,
    })),
  ),
  "text-case-converter": load(() =>
    import("@/components/tools/TextCaseConverter").then((m) => ({
      default: m.TextCaseConverter,
    })),
  ),
  "percentage-calculator": load(() =>
    import("@/components/tools/PercentageCalculator").then((m) => ({
      default: m.PercentageCalculator,
    })),
  ),
  "age-calculator": load(() =>
    import("@/components/tools/AgeCalculator").then((m) => ({
      default: m.AgeCalculator,
    })),
  ),
  "gpa-calculator": load(() =>
    import("@/components/tools/GpaCalculator").then((m) => ({
      default: m.GpaCalculator,
    })),
  ),
  "password-generator": load(() =>
    import("@/components/tools/PasswordGenerator").then((m) => ({
      default: m.PasswordGenerator,
    })),
  ),
  "uuid-generator": load(() =>
    import("@/components/tools/UuidGenerator").then((m) => ({
      default: m.UuidGenerator,
    })),
  ),
  "markdown-editor": load(() =>
    import("@/components/tools/MarkdownEditor").then((m) => ({
      default: m.MarkdownEditor,
    })),
  ),
  "pdf-merger": load(() =>
    import("@/components/tools/PdfMerger").then((m) => ({ default: m.PdfMerger })),
  ),
  "pdf-splitter": load(() =>
    import("@/components/tools/PdfSplitter").then((m) => ({ default: m.PdfSplitter })),
  ),
  "final-grade-calculator": load(() =>
    import("@/components/tools/FinalGradeCalculator").then((m) => ({
      default: m.FinalGradeCalculator,
    })),
  ),
  "profit-margin-calculator": load(() =>
    import("@/components/tools/ProfitMarginCalculator").then((m) => ({
      default: m.ProfitMarginCalculator,
    })),
  ),
  "simple-interest-calculator": load(() =>
    import("@/components/tools/SimpleInterestCalculator").then((m) => ({
      default: m.SimpleInterestCalculator,
    })),
  ),
  "slug-generator": load(() =>
    import("@/components/tools/SlugGenerator").then((m) => ({ default: m.SlugGenerator })),
  ),
  "keyword-density-checker": load(() =>
    import("@/components/tools/KeywordDensityChecker").then((m) => ({
      default: m.KeywordDensityChecker,
    })),
  ),
  "color-contrast-checker": load(() =>
    import("@/components/tools/ColorContrastChecker").then((m) => ({
      default: m.ColorContrastChecker,
    })),
  ),
  "social-caption-counter": load(() =>
    import("@/components/tools/SocialCaptionCounter").then((m) => ({
      default: m.SocialCaptionCounter,
    })),
  ),
  "days-between-dates": load(() =>
    import("@/components/tools/DaysBetweenDates").then((m) => ({
      default: m.DaysBetweenDates,
    })),
  ),
  "ai-writing-assistant": load(() =>
    import("@/components/tools/AiImproveWriting").then((m) => ({
      default: m.AiImproveWriting,
    })),
  ),
  "ai-summarizer": load(() =>
    import("@/components/tools/AiSummarizer").then((m) => ({
      default: m.AiSummarizer,
    })),
  ),
  "ai-title-generator": load(() =>
    import("@/components/tools/AiTitleGenerator").then((m) => ({
      default: m.AiTitleGenerator,
    })),
  ),
  "text-diff-checker": load(() =>
    import("@/components/tools/TextDiffChecker").then((m) => ({
      default: m.TextDiffChecker,
    })),
  ),
  "regex-tester": load(() =>
    import("@/components/tools/RegexTester").then((m) => ({
      default: m.RegexTester,
    })),
  ),
  "unix-timestamp-converter": load(() =>
    import("@/components/tools/UnixTimestampConverter").then((m) => ({
      default: m.UnixTimestampConverter,
    })),
  ),
  "csv-to-json": load(() =>
    import("@/components/tools/CsvToJson").then((m) => ({ default: m.CsvToJson })),
  ),
  "json-to-csv": load(() =>
    import("@/components/tools/JsonToCsv").then((m) => ({ default: m.JsonToCsv })),
  ),
  "jwt-decoder": load(() =>
    import("@/components/tools/JwtDecoder").then((m) => ({ default: m.JwtDecoder })),
  ),
  "cgpa-calculator": load(() =>
    import("@/components/tools/CgpaCalculator").then((m) => ({ default: m.CgpaCalculator })),
  ),
  "grade-calculator": load(() =>
    import("@/components/tools/GradeCalculator").then((m) => ({ default: m.GradeCalculator })),
  ),
  "pomodoro-timer": load(() =>
    import("@/components/tools/PomodoroTimer").then((m) => ({ default: m.PomodoroTimer })),
  ),
  "discount-calculator": load(() =>
    import("@/components/tools/DiscountCalculator").then((m) => ({ default: m.DiscountCalculator })),
  ),
  "vat-calculator": load(() =>
    import("@/components/tools/VatCalculator").then((m) => ({ default: m.VatCalculator })),
  ),
  "loan-calculator": load(() =>
    import("@/components/tools/LoanCalculator").then((m) => ({ default: m.LoanCalculator })),
  ),
  "compound-interest-calculator": load(() =>
    import("@/components/tools/CompoundInterestCalculator").then((m) => ({
      default: m.CompoundInterestCalculator,
    })),
  ),
  "tip-split-calculator": load(() =>
    import("@/components/tools/TipSplitCalculator").then((m) => ({ default: m.TipSplitCalculator })),
  ),
  "image-format-converter": load(() =>
    import("@/components/tools/ImageFormatConverter").then((m) => ({ default: m.ImageFormatConverter })),
  ),
  "image-cropper": load(() =>
    import("@/components/tools/ImageCropper").then((m) => ({ default: m.ImageCropper })),
  ),
  "exif-remover": load(() =>
    import("@/components/tools/ExifRemover").then((m) => ({ default: m.ExifRemover })),
  ),
  "jpg-to-pdf": load(() =>
    import("@/components/tools/JpgToPdf").then((m) => ({ default: m.JpgToPdf })),
  ),
  "open-graph-generator": load(() =>
    import("@/components/tools/OgGenerator").then((m) => ({ default: m.OgGenerator })),
  ),
  "robots-generator": load(() =>
    import("@/components/tools/RobotsGenerator").then((m) => ({ default: m.RobotsGenerator })),
  ),
  "schema-markup-generator": load(() =>
    import("@/components/tools/SchemaMarkupGenerator").then((m) => ({
      default: m.SchemaMarkupGenerator,
    })),
  ),
  "readability-score": load(() =>
    import("@/components/tools/ReadabilityScore").then((m) => ({ default: m.ReadabilityScore })),
  ),
};

export function ToolLoader({ slug }: { slug: string }) {
  const Tool = toolComponents[slug];

  if (!Tool) {
    return (
      <div className="rounded-card border border-danger/30 bg-danger-soft p-6 text-sm text-danger">
        This tool is not available yet.
      </div>
    );
  }

  return <Tool />;
}
