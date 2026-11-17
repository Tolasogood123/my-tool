/** Reads values the browser exposes to this page. No value leaves the device. */

export interface BrowserFacts {
  userAgent: string;
  language: string;
  languages: string;
  platform: string;
  vendor: string;
  screen: string;
  colorDepth: string;
  pixelRatio: string;
  viewport: string;
  timezone: string;
  timezoneOffset: string;
  cookiesEnabled: string;
  doNotTrack: string;
  hardwareConcurrency: string;
  deviceMemory: string;
  maxTouchPoints: string;
  online: string;
}

function emptyFacts(): BrowserFacts {
  const unavailable = "Unavailable";
  return {
    userAgent: unavailable,
    language: unavailable,
    languages: unavailable,
    platform: unavailable,
    vendor: unavailable,
    screen: unavailable,
    colorDepth: unavailable,
    pixelRatio: unavailable,
    viewport: unavailable,
    timezone: unavailable,
    timezoneOffset: unavailable,
    cookiesEnabled: unavailable,
    doNotTrack: unavailable,
    hardwareConcurrency: unavailable,
    deviceMemory: unavailable,
    maxTouchPoints: unavailable,
    online: unavailable,
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Collects navigator, screen and viewport facts from the current browser. */
export function collectBrowserFacts(): BrowserFacts {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return emptyFacts();
  }

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    msMaxTouchPoints?: number;
    doNotTrack?: string | null;
  };
  const win = window as Window & { doNotTrack?: string | null };
  const screenInfo = window.screen;

  let timezone = "Unavailable";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unavailable";
  } catch {
    timezone = "Unavailable";
  }

  const offsetMinutes = -new Date().getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const offset = `UTC${sign}${pad(Math.floor(Math.abs(offsetMinutes) / 60))}:${pad(Math.abs(offsetMinutes) % 60)}`;

  const languages = Array.isArray(nav.languages)
    ? nav.languages.join(", ")
    : nav.language || "Unavailable";

  const touchPoints = nav.maxTouchPoints ?? nav.msMaxTouchPoints ?? 0;
  const dpr = window.devicePixelRatio || 1;
  const dnt = nav.doNotTrack ?? win.doNotTrack;

  return {
    userAgent: nav.userAgent || "Unavailable",
    language: nav.language || "Unavailable",
    languages,
    platform: nav.platform || "Unavailable",
    vendor: nav.vendor || "Unavailable",
    screen: screenInfo ? `${screenInfo.width} × ${screenInfo.height}` : "Unavailable",
    colorDepth: screenInfo ? `${screenInfo.colorDepth}-bit` : "Unavailable",
    pixelRatio: `${dpr}×`,
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    timezone,
    timezoneOffset: offset,
    cookiesEnabled: nav.cookieEnabled ? "Yes" : "No",
    doNotTrack: dnt === null || dnt === undefined ? "Not set" : String(dnt),
    hardwareConcurrency: nav.hardwareConcurrency ? String(nav.hardwareConcurrency) : "Unavailable",
    deviceMemory: nav.deviceMemory ? `~${nav.deviceMemory} GB` : "Unavailable",
    maxTouchPoints: String(touchPoints),
    online: nav.onLine ? "Online" : "Offline",
  };
}

/** Stable label / value pairs used by the interface. */
export const BROWSER_FACT_LABELS: Array<{ key: keyof BrowserFacts; label: string }> = [
  { key: "userAgent", label: "User-agent string" },
  { key: "language", label: "Primary language" },
  { key: "languages", label: "Preferred languages" },
  { key: "platform", label: "Platform" },
  { key: "vendor", label: "Browser vendor" },
  { key: "screen", label: "Screen size" },
  { key: "colorDepth", label: "Colour depth" },
  { key: "pixelRatio", label: "Device pixel ratio" },
  { key: "viewport", label: "Viewport size" },
  { key: "timezone", label: "Time zone" },
  { key: "timezoneOffset", label: "UTC offset" },
  { key: "cookiesEnabled", label: "Cookies enabled" },
  { key: "doNotTrack", label: "Do Not Track" },
  { key: "hardwareConcurrency", label: "Logical CPU cores" },
  { key: "deviceMemory", label: "Device memory" },
  { key: "maxTouchPoints", label: "Touch points" },
  { key: "online", label: "Connection status" },
];

/** Human-readable, copyable report of the collected facts. */
export function formatBrowserFacts(facts: BrowserFacts): string {
  return BROWSER_FACT_LABELS.map(({ key, label }) => `${label}: ${facts[key]}`).join("\n");
}
