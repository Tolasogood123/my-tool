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
  "video-thumbnail-extractor": load(() =>
    import("@/components/tools/VideoThumbnailExtractor").then((m) => ({
      default: m.VideoThumbnailExtractor,
    })),
  ),
  "break-even-calculator": load(() =>
    import("@/components/tools/BreakEvenCalculator").then((m) => ({ default: m.BreakEvenCalculator })),
  ),
  "marketplace-fee-calculator": load(() =>
    import("@/components/tools/MarketplaceFeeCalculator").then((m) => ({ default: m.MarketplaceFeeCalculator })),
  ),
  "ecommerce-profit-calculator": load(() =>
    import("@/components/tools/EcommerceProfitCalculator").then((m) => ({ default: m.EcommerceProfitCalculator })),
  ),
  "wholesale-price-calculator": load(() =>
    import("@/components/tools/WholesalePriceCalculator").then((m) => ({ default: m.WholesalePriceCalculator })),
  ),
  "product-sku-generator": load(() =>
    import("@/components/tools/ProductSkuGenerator").then((m) => ({ default: m.ProductSkuGenerator })),
  ),
  "audio-trimmer": load(() =>
    import("@/components/tools/AudioTrimmer").then((m) => ({ default: m.AudioTrimmer })),
  ),
  "audio-volume-booster": load(() =>
    import("@/components/tools/AudioVolumeBooster").then((m) => ({ default: m.AudioVolumeBooster })),
  ),
  "audio-speed-changer": load(() =>
    import("@/components/tools/AudioSpeedChanger").then((m) => ({ default: m.AudioSpeedChanger })),
  ),
  "subtitle-converter": load(() =>
    import("@/components/tools/SubtitleConverter").then((m) => ({ default: m.SubtitleConverter })),
  ),
  "barcode-generator": load(() =>
    import("@/components/tools/BarcodeGenerator").then((m) => ({ default: m.BarcodeGenerator })),
  ),
  "shipping-cost-calculator": load(() =>
    import("@/components/tools/ShippingCostCalculator").then((m) => ({ default: m.ShippingCostCalculator })),
  ),
  "inventory-calculator": load(() =>
    import("@/components/tools/InventoryCalculator").then((m) => ({ default: m.InventoryCalculator })),
  ),
  "return-policy-generator": load(() =>
    import("@/components/tools/ReturnPolicyGenerator").then((m) => ({ default: m.ReturnPolicyGenerator })),
  ),
  "discount-price-generator": load(() =>
    import("@/components/tools/DiscountPriceGenerator").then((m) => ({ default: m.DiscountPriceGenerator })),
  ),
  "content-calendar-generator": load(() =>
    import("@/components/tools/ContentCalendarGenerator").then((m) => ({ default: m.ContentCalendarGenerator })),
  ),
  "instagram-grid-planner": load(() =>
    import("@/components/tools/InstagramGridPlanner").then((m) => ({ default: m.InstagramGridPlanner })),
  ),
  "link-in-bio-generator": load(() =>
    import("@/components/tools/LinkInBioGenerator").then((m) => ({ default: m.LinkInBioGenerator })),
  ),
  "social-image-resizer": load(() =>
    import("@/components/tools/SocialImageResizer").then((m) => ({ default: m.SocialImageResizer })),
  ),
  "utm-link-builder": load(() =>
    import("@/components/tools/UtmLinkBuilder").then((m) => ({ default: m.UtmLinkBuilder })),
  ),
  "ip-subnet-calculator": load(() =>
    import("@/components/tools/IpSubnetCalculator").then((m) => ({ default: m.IpSubnetCalculator })),
  ),
  "user-agent-parser": load(() =>
    import("@/components/tools/UserAgentParser").then((m) => ({ default: m.UserAgentParser })),
  ),
  "browser-information": load(() =>
    import("@/components/tools/BrowserInformation").then((m) => ({ default: m.BrowserInformation })),
  ),
  "http-status-reference": load(() =>
    import("@/components/tools/HttpStatusReference").then((m) => ({ default: m.HttpStatusReference })),
  ),
  "network-port-reference": load(() =>
    import("@/components/tools/NetworkPortReference").then((m) => ({ default: m.NetworkPortReference })),
  ),
  "color-blindness-simulator": load(() =>
    import("@/components/tools/ColorBlindnessSimulator").then((m) => ({ default: m.ColorBlindnessSimulator })),
  ),
  "nato-phonetic-converter": load(() =>
    import("@/components/tools/NatoPhoneticConverter").then((m) => ({ default: m.NatoPhoneticConverter })),
  ),
  "morse-code-translator": load(() =>
    import("@/components/tools/MorseCodeTranslator").then((m) => ({ default: m.MorseCodeTranslator })),
  ),
  "khmer-numeral-converter": load(() =>
    import("@/components/tools/KhmerNumeralConverter").then((m) => ({ default: m.KhmerNumeralConverter })),
  ),
  "number-to-words": load(() =>
    import("@/components/tools/NumberToWords").then((m) => ({ default: m.NumberToWords })),
  ),
  "cron-generator": load(() =>
    import("@/components/tools/CronGenerator").then((m) => ({ default: m.CronGenerator })),
  ),
  "css-gradient-generator": load(() =>
    import("@/components/tools/CssGradientGenerator").then((m) => ({ default: m.CssGradientGenerator })),
  ),
  "box-shadow-generator": load(() =>
    import("@/components/tools/BoxShadowGenerator").then((m) => ({ default: m.BoxShadowGenerator })),
  ),
  "gitignore-generator": load(() =>
    import("@/components/tools/GitignoreGenerator").then((m) => ({ default: m.GitignoreGenerator })),
  ),
  "mock-json-generator": load(() =>
    import("@/components/tools/MockJsonGenerator").then((m) => ({ default: m.MockJsonGenerator })),
  ),
  "scientific-calculator": load(() =>
    import("@/components/tools/ScientificCalculator").then((m) => ({ default: m.ScientificCalculator })),
  ),
  "matrix-calculator": load(() =>
    import("@/components/tools/MatrixCalculator").then((m) => ({ default: m.MatrixCalculator })),
  ),
  "equation-solver": load(() =>
    import("@/components/tools/EquationSolver").then((m) => ({ default: m.EquationSolver })),
  ),
  "citation-generator": load(() =>
    import("@/components/tools/CitationGenerator").then((m) => ({ default: m.CitationGenerator })),
  ),
  "study-timetable-generator": load(() =>
    import("@/components/tools/StudyTimetableGenerator").then((m) => ({ default: m.StudyTimetableGenerator })),
  ),
  "time-zone-converter": load(() =>
    import("@/components/tools/TimeZoneConverter").then((m) => ({ default: m.TimeZoneConverter })),
  ),
  "meeting-time-planner": load(() =>
    import("@/components/tools/MeetingTimePlanner").then((m) => ({ default: m.MeetingTimePlanner })),
  ),
  "sleep-cycle-calculator": load(() =>
    import("@/components/tools/SleepCycleCalculator").then((m) => ({ default: m.SleepCycleCalculator })),
  ),
  "calorie-calculator": load(() =>
    import("@/components/tools/CalorieCalculator").then((m) => ({ default: m.CalorieCalculator })),
  ),
  "water-intake-calculator": load(() =>
    import("@/components/tools/WaterIntakeCalculator").then((m) => ({ default: m.WaterIntakeCalculator })),
  ),
  "pdf-page-numbering": load(() =>
    import("@/components/tools/PdfPageNumbering").then((m) => ({ default: m.PdfPageNumbering })),
  ),
  "pdf-watermark": load(() =>
    import("@/components/tools/PdfWatermark").then((m) => ({ default: m.PdfWatermark })),
  ),
  "image-color-picker": load(() =>
    import("@/components/tools/ImageColorPicker").then((m) => ({ default: m.ImageColorPicker })),
  ),
  "passport-photo-maker": load(() =>
    import("@/components/tools/PassportPhotoMaker").then((m) => ({ default: m.PassportPhotoMaker })),
  ),
  "svg-to-jsx": load(() =>
    import("@/components/tools/SvgToJsx").then((m) => ({ default: m.SvgToJsx })),
  ),
  "unit-converter": load(() =>
    import("@/components/tools/UnitConverter").then((m) => ({ default: m.UnitConverter })),
  ),
  "bmi-calculator": load(() =>
    import("@/components/tools/BmiCalculator").then((m) => ({ default: m.BmiCalculator })),
  ),
  "lorem-ipsum-generator": load(() =>
    import("@/components/tools/LoremIpsumGenerator").then((m) => ({ default: m.LoremIpsumGenerator })),
  ),
  "sql-formatter": load(() =>
    import("@/components/tools/SqlFormatter").then((m) => ({ default: m.SqlFormatter })),
  ),
  "hash-generator": load(() =>
    import("@/components/tools/HashGenerator").then((m) => ({ default: m.HashGenerator })),
  ),
  "invoice-generator": load(() =>
    import("@/components/tools/InvoiceGenerator").then((m) => ({ default: m.InvoiceGenerator })),
  ),
  "freelance-rate-calculator": load(() =>
    import("@/components/tools/FreelanceRateCalculator").then((m) => ({ default: m.FreelanceRateCalculator })),
  ),
  "savings-goal-calculator": load(() =>
    import("@/components/tools/SavingsGoalCalculator").then((m) => ({ default: m.SavingsGoalCalculator })),
  ),
  "image-rotator": load(() =>
    import("@/components/tools/ImageRotator").then((m) => ({ default: m.ImageRotator })),
  ),
  "favicon-generator": load(() =>
    import("@/components/tools/FaviconGenerator").then((m) => ({ default: m.FaviconGenerator })),
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
