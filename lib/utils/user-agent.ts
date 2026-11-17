/** Heuristic, dependency-free parsing of a user-agent string. No network calls. */

export interface UserAgentInfo {
  raw: string;
  browser: string;
  browserName: string;
  browserVersion: string;
  engine: string;
  os: string;
  device: string;
  isBot: boolean;
  isMobile: boolean;
}

interface BrowserPattern {
  name: string;
  re: RegExp;
}

const BROWSER_PATTERNS: BrowserPattern[] = [
  { name: "Microsoft Edge", re: /Edg(?:e|A|iOS)?\/([\d.]+)/ },
  { name: "Opera", re: /OPR\/([\d.]+)|Opera\/([\d.]+)/ },
  { name: "Samsung Internet", re: /SamsungBrowser\/([\d.]+)/ },
  { name: "Firefox", re: /Firefox\/([\d.]+)|FxiOS\/([\d.]+)/ },
  { name: "Chrome", re: /Chrome\/([\d.]+)|CriOS\/([\d.]+)/ },
  { name: "Safari", re: /Version\/([\d.]+).*Safari\// },
  { name: "Internet Explorer", re: /Trident\/.*rv:([\d.]+)/ },
];

const BOT_RE = /bot|crawler|spider|crawl|slurp|bingpreview|facebookexternalhit|curl|wget|postman|python-requests|headless|http:\/\/|https:\/\//i;

function findVersion(ua: string, re: RegExp): string {
  const match = re.exec(ua);
  if (!match) return "";
  for (let i = 1; i < match.length; i += 1) {
    if (match[i]) return match[i];
  }
  return "";
}

function detectEngine(ua: string): string {
  if (/Trident\//.test(ua)) return "Trident (legacy IE)";
  if (/Edg(?:e|A|iOS)?\/|Chrome\/|CriOS\/|OPR\/|Chromium\//.test(ua)) return "Blink (Chromium)";
  if (/AppleWebKit\//.test(ua)) return "WebKit";
  if (/Gecko\//.test(ua)) return "Gecko";
  return "Unrecognised";
}

function detectOs(ua: string): string {
  let match: RegExpExecArray | null;

  if ((match = /Windows NT (\d+\.\d+)/.exec(ua))) {
    const names: Record<string, string> = {
      "10.0": "Windows 10 / 11",
      "6.4": "Windows 10",
      "6.3": "Windows 8.1",
      "6.2": "Windows 8",
      "6.1": "Windows 7",
      "6.0": "Windows Vista",
      "5.1": "Windows XP",
    };
    return names[match[1]] ?? `Windows NT ${match[1]}`;
  }
  if ((match = /Android ([\d.]+)/.exec(ua))) return `Android ${match[1]}`;
  if ((match = /CrOS \w+ ([\d.]+)[\d.]*/.exec(ua))) return `ChromeOS ${match[1]}`;
  if ((match = /(?:iPhone )?OS (\d+)[_.](\d+)(?:[_.](\d+))?/.exec(ua))) {
    const name = /iPad|Tablet/.test(ua) ? "iPadOS" : "iOS";
    return `${name} ${match[1]}.${match[2]}${match[3] ? `.${match[3]}` : ""}`;
  }
  if ((match = /Mac OS X (\d+)[_.](\d+)(?:[_.](\d+))?/.exec(ua))) {
    const major = Number(match[1]);
    if (major >= 11) return `macOS ${match[1]}${match[2] !== "0" ? `.${match[2]}` : ""}`;
    return `macOS ${match[1]}.${match[2]}${match[3] ? `.${match[3]}` : ""}`;
  }
  if (/Ubuntu/.test(ua)) return "Ubuntu";
  if (/Linux|X11/.test(ua)) return "Linux";
  return "Unrecognised";
}

/** Parses a pasted user-agent string into the components it advertises. */
export function parseUserAgent(rawInput: string): UserAgentInfo {
  const raw = rawInput.trim();
  const isBot = BOT_RE.test(raw);

  let browserName = "";
  let browserVersion = "";
  for (const pattern of BROWSER_PATTERNS) {
    const version = findVersion(raw, pattern.re);
    if (version) {
      browserName = pattern.name;
      browserVersion = version;
      break;
    }
  }
  if (!browserName) browserName = isBot ? "Automated client" : "Unrecognised browser";

  const os = detectOs(raw);
  const engine = detectEngine(raw);

  let device = "Desktop / laptop";
  if (isBot) device = "Bot / crawler";
  else if (/iPad|Tablet/.test(raw)) device = "Tablet";
  else if (/iPhone|iPod/.test(raw)) device = "Mobile phone";
  else if (/Android/.test(raw) && /Mobile/.test(raw)) device = "Mobile phone";
  else if (/Android/.test(raw)) device = "Tablet";

  const isMobile = /Mobile|iPhone|iPod|Android.*Mobile/i.test(raw) && !isBot;

  return {
    raw,
    browser: browserVersion ? `${browserName} ${browserVersion}` : browserName,
    browserName,
    browserVersion,
    engine,
    os,
    device,
    isBot,
    isMobile,
  };
}

/** Human-readable, copyable report of the parsed values. */
export function formatUserAgentReport(info: UserAgentInfo): string {
  return [
    `Browser:   ${info.browser}`,
    `Engine:    ${info.engine}`,
    `OS:        ${info.os}`,
    `Device:    ${info.device}`,
    `Mobile:    ${info.isMobile ? "Yes" : "No"}`,
    `Automated: ${info.isBot ? "Likely bot / crawler" : "No bot signature detected"}`,
    "",
    `User-agent string:`,
    info.raw,
    "",
    "Reminder: user-agent strings are supplied by the client and can be spoofed.",
  ].join("\n");
}
