"use client";

import { CsvConverter } from "@/components/tools/CsvConverter";

export function JsonToCsv() {
  return <CsvConverter mode="to-csv" />;
}
