/** Pure wholesale price calculations derived from a retail price and a margin model. */

export type WholesaleMode = "keystone" | "margin" | "markup";

export interface WholesaleResult {
  retailPrice: number;
  mode: WholesaleMode;
  inputPercent: number;
  wholesalePrice: number;
  retailerMargin: number;
  retailerMarkup: number;
  ratio: number;
}

export function calculateWholesale(
  retailPrice: number,
  mode: WholesaleMode,
  percent: number,
): { result: WholesaleResult | null; error: string | null } {
  if (!Number.isFinite(retailPrice) || retailPrice <= 0) {
    return { result: null, error: "Enter a retail price greater than zero." };
  }

  let wholesalePrice: number;
  let inputPercent = 0;

  if (mode === "keystone") {
    wholesalePrice = retailPrice / 2;
  } else if (mode === "margin") {
    if (!Number.isFinite(percent) || percent < 0 || percent >= 100) {
      return {
        result: null,
        error: "Desired retail margin must be between 0% and under 100%.",
      };
    }
    inputPercent = percent;
    wholesalePrice = retailPrice * (1 - percent / 100);
  } else if (mode === "markup") {
    if (!Number.isFinite(percent) || percent < 0) {
      return { result: null, error: "Enter a markup of zero or more." };
    }
    inputPercent = percent;
    wholesalePrice = retailPrice / (1 + percent / 100);
  } else {
    return { result: null, error: "Choose a valid pricing model." };
  }

  if (wholesalePrice <= 0) {
    return {
      result: null,
      error:
        "These inputs produce a wholesale price of zero or less. Try a lower margin.",
    };
  }

  const spread = retailPrice - wholesalePrice;
  return {
    result: {
      retailPrice,
      mode,
      inputPercent,
      wholesalePrice,
      retailerMargin: (spread / retailPrice) * 100,
      retailerMarkup: (spread / wholesalePrice) * 100,
      ratio: (wholesalePrice / retailPrice) * 100,
    },
    error: null,
  };
}
