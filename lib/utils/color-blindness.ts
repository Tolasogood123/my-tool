/** Pure helpers for simulating common color vision deficiencies on canvas. */

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";

/** A row-major 3x3 matrix that maps source RGB to simulated RGB. */
export type ColorMatrix = readonly [
  number, number, number,
  number, number, number,
  number, number, number,
];

export interface DeficiencyInfo {
  id: string;
  label: string;
  short: string;
  description: string;
  matrix: ColorMatrix;
}

/**
 * Simulation matrices from Machado, Oliveira & Fernandes (2009), severity 1.0.
 * These approximate how a trichromatic/dichromatic observer perceives color;
 * they are a visualization aid, not a medical diagnostic tool.
 */
export const COLOR_DEFICIENCIES: DeficiencyInfo[] = [
  {
    id: "protanopia",
    label: "Protanopia (red-blind)",
    short: "Protanopia",
    description: "Reduced sensitivity to long-wavelength (red) light; reds appear dark.",
    matrix: [
      0.152286, 1.052583, -0.204868,
      0.114503, 0.786281, 0.099216,
      -0.003882, -0.048116, 1.051998,
    ],
  },
  {
    id: "deuteranopia",
    label: "Deuteranopia (green-blind)",
    short: "Deuteranopia",
    description: "Reduced sensitivity to medium-wavelength (green) light; red and green blur together.",
    matrix: [
      0.367322, 0.860646, -0.227968,
      0.280085, 0.672501, 0.047413,
      -0.011820, 0.042940, 0.968881,
    ],
  },
  {
    id: "tritanopia",
    label: "Tritanopia (blue-blind)",
    short: "Tritanopia",
    description: "Reduced sensitivity to short-wavelength (blue) light; blue and yellow are confused.",
    matrix: [
      1.255528, -0.076749, -0.178779,
      -0.078411, 0.930809, 0.147602,
      0.004733, 0.691367, 0.303900,
    ],
  },
  {
    id: "protanomaly",
    label: "Protanomaly (red-weak)",
    short: "Protanomaly",
    description: "A milder form of red deficiency rather than a complete loss.",
    matrix: [
      0.817236, 0.190392, -0.007628,
      0.159204, 0.838344, 0.002452,
      -0.002476, 0.008376, 0.994100,
    ],
  },
  {
    id: "deuteranomaly",
    label: "Deuteranomaly (green-weak)",
    short: "Deuteranomaly",
    description: "The most common form of color deficiency; green appears muted.",
    matrix: [
      0.625809, 0.357338, 0.016853,
      0.091752, 0.834902, 0.073346,
      0.000323, 0.008192, 0.991485,
    ],
  },
  {
    id: "tritanomaly",
    label: "Tritanomaly (blue-weak)",
    short: "Tritanomaly",
    description: "A milder form of blue deficiency, rare in the general population.",
    matrix: [
      0.949562, 0.107051, -0.056613,
      0.026849, 0.900805, 0.072346,
      -0.002092, 0.053358, 0.948734,
    ],
  },
  {
    id: "achromatopsia",
    label: "Achromatopsia (no color)",
    short: "Achromatopsia",
    description: "Full color blindness; the image is perceived only in shades of gray.",
    matrix: [
      0.290312, 0.604277, 0.105411,
      0.290312, 0.604277, 0.105411,
      0.290312, 0.604277, 0.105411,
    ],
  },
  {
    id: "achromatomaly",
    label: "Achromatomaly (low color)",
    short: "Achromatomaly",
    description: "Partial color loss; colors appear washed out and hard to distinguish.",
    matrix: [
      0.618181, 0.323401, 0.058418,
      0.236885, 0.680456, 0.082659,
      0.081743, 0.254900, 0.663357,
    ],
  },
];

export const IDENTITY_MATRIX: ColorMatrix = [
  1, 0, 0,
  0, 1, 0,
  0, 0, 1,
];

/** Returns the configured matrix for a deficiency id, or the identity matrix. */
export function getMatrix(deficiencyId: string): ColorMatrix {
  return COLOR_DEFICIENCIES.find((item) => item.id === deficiencyId)?.matrix ?? IDENTITY_MATRIX;
}

function clampChannel(value: number): number {
  if (value < 0) return 0;
  if (value > 255) return 255;
  return Math.round(value);
}

/** Transforms a single RGB triplet using a row-major 3x3 matrix. */
export function transformRgb(
  r: number,
  g: number,
  b: number,
  matrix: ColorMatrix,
): [number, number, number] {
  return [
    clampChannel(matrix[0] * r + matrix[1] * g + matrix[2] * b),
    clampChannel(matrix[3] * r + matrix[4] * g + matrix[5] * b),
    clampChannel(matrix[6] * r + matrix[7] * g + matrix[8] * b),
  ];
}

/** Applies a color matrix to the pixel buffer of an ImageData in place. */
export function applyMatrixToImageData(imageData: ImageData, matrix: ColorMatrix): void {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = transformRgb(data[i], data[i + 1], data[i + 2], matrix);
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
}

/** Validates an uploaded raster image by MIME type and size. */
export function validateImageFile(file: File): string | null {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Unsupported file type. Choose a JPEG, PNG, or WebP image.";
  }
  if (file.size === 0) return "That file is empty. Choose another image.";
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return `That image is ${formatBytes(file.size)}. The maximum is ${formatBytes(MAX_IMAGE_UPLOAD_BYTES)}.`;
  }
  return null;
}
