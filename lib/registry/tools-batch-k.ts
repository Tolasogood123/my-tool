import type { Tool } from "@/types/tool";

/** Batch K: IPv4 and browser/privacy reference tools (tools 21–25). */
export const batchKTools: Tool[] = [
  {
    slug: "ip-subnet-calculator",
    title: "IP Subnet Calculator",
    description:
      "Work out the network, broadcast, subnet mask, host range and usable address count for any IPv4 CIDR block, with octet and prefix validation.",
    category: "security-privacy",
    keywords: ["IP subnet calculator", "IPv4 CIDR calculator", "network address", "broadcast address", "subnet mask", "usable hosts"],
    icon: "Search",
    status: "ready",
    popularity: 82,
    addedAt: "2026-11-22",
    related: ["network-port-reference", "browser-information", "regex-tester", "jwt-decoder"],
    content: {
      what: "The IP Subnet Calculator applies IPv4 subnetting maths to a CIDR block you enter. It masks off host bits to find the network address, ORs in the inverse mask to find the broadcast address, and reports the subnet mask, wildcard mask, first and last usable hosts, total addresses and usable host count. Every octet and the prefix length are validated before the result is drawn, and nothing you type leaves your browser.",
      howTo: [
        "Enter an IPv4 address in CIDR form, such as 192.168.1.0/24, or pick an example.",
        "Check that the octets are between 0 and 255 and the prefix is 0 to 32.",
        "Click Calculate subnet to see the network, broadcast and host range.",
        "Copy or download the report, or Reset to try another block.",
      ],
      example:
        "Entering 192.168.1.130/26 yields network 192.168.1.128, broadcast 192.168.1.191, a subnet mask of 255.255.255.192 and usable hosts from 192.168.1.129 to 192.168.1.190 (62 addresses).",
      benefits: [
        "Get the network and broadcast addresses without manual binary conversion.",
        "See both subnet and wildcard masks, useful for ACLs and firewall rules.",
        "Validation catches invalid octets and out-of-range prefixes immediately.",
        "Works offline in your browser; no address is transmitted or stored.",
      ],
      faqs: [
        {
          q: "What happens if I leave off the prefix?",
          a: "A bare address such as 10.0.0.1 is treated as a single host, which is the same as /32. You get a one-address block with no separate network or broadcast pair.",
        },
        {
          q: "Why are two addresses subtracted from the usable host count?",
          a: "In a conventional subnet the network address identifies the block and the broadcast address reaches every host, so neither is assignable. For /31 and /32 the tool follows the special point-to-point and host-route conventions instead.",
        },
        {
          q: "Does it support IPv6?",
          a: "No. This tool is built around 32-bit IPv4 arithmetic. For subnetting you need an IPv6-specific calculator that works with 128-bit addresses and hexadecimal notation.",
        },
        {
          q: "What does 'host bits were set' mean?",
          a: "It means the address you entered was not the network address itself. The calculator applies the mask and shows the true network address, so 192.168.1.130/26 correctly resolves to the .128 network.",
        },
      ],
    },
  },
  {
    slug: "user-agent-parser",
    title: "User-Agent Parser",
    description:
      "Parse a pasted user-agent string or your own browser's UA into browser, engine, operating system and device fields, with a clear spoofing warning.",
    category: "security-privacy",
    keywords: ["user agent parser", "UA string parser", "browser detection", "device detection", "user agent analyzer", "spoofing"],
    icon: "Fingerprint",
    status: "ready",
    popularity: 75,
    addedAt: "2026-11-22",
    related: ["browser-information", "ip-subnet-calculator", "http-status-reference", "network-port-reference"],
    content: {
      what: "The User-Agent Parser reads the text a client sends in its user-agent header and breaks it into recognisable parts: browser and version, rendering engine, operating system, device type and whether it looks like an automated client. You can paste any string or load the one your browser currently uses. Parsing is heuristic and happens locally, and the tool states plainly that user-agent strings can be changed by the client.",
      howTo: [
        "Paste a complete user-agent string into the text box.",
        "Alternatively click Use my browser's UA to load your own value.",
        "Click Parse user-agent to reveal the detected fields.",
        "Copy or download the report, or Reset to parse another string.",
      ],
      example:
        "A Chrome UA on Windows 10 resolves to browser Chrome with a Blink engine, Windows 10 / 11 as the OS, a desktop device and no bot signature. A Googlebot UA is flagged as an automated client.",
      benefits: [
        "Understand what a UA string claims about a visitor's setup.",
        "Quickly check whether traffic looks like a crawler or a real browser.",
        "Load your own UA with one click for immediate testing.",
        "No data is sent to a server; parsing runs entirely in the page.",
      ],
      faqs: [
        {
          q: "Can I trust the detected browser or operating system?",
          a: "Only as a hint. A user-agent is self-reported text and can be edited by the user, an extension or a script. For reliable capability checks, feature detection in your code is a better approach.",
        },
        {
          q: "Why does my UA look different from a common example?",
          a: "Browsers freeze or reduce user-agent strings to limit fingerprinting, so modern values can be less detailed than older ones. The parser works with whatever tokens are actually present.",
        },
        {
          q: "Does this identify a specific person?",
          a: "No. A user-agent describes a class of client and is shared by many people. It cannot, on its own, single out an individual.",
        },
        {
          q: "How is a bot detected?",
          a: "The parser looks for common words and URLs used by crawlers and automated HTTP clients. It is a pattern match, so a custom bot may not be recognised and a regular browser could include such words deliberately.",
        },
      ],
    },
  },
  {
    slug: "browser-information",
    title: "Browser Information Checker",
    description:
      "See the language, platform, screen, viewport, timezone and other facts your browser exposes to web pages, with a clear note that nothing is transmitted.",
    category: "security-privacy",
    keywords: ["browser information", "browser facts", "screen resolution checker", "timezone detector", "navigator properties", "privacy check"],
    icon: "ShieldCheck",
    status: "ready",
    popularity: 74,
    addedAt: "2026-11-22",
    related: ["user-agent-parser", "exif-remover", "ip-subnet-calculator", "http-status-reference"],
    content: {
      what: "The Browser Information Checker displays the values your own browser makes available to a page: language preferences, platform and vendor, screen and viewport size, colour depth, pixel ratio, time zone and UTC offset, cookie and Do Not Track settings, and a few hardware hints. The values are collected in the page and shown immediately. The tool makes it explicit that no request is made and nothing you see is sent anywhere.",
      howTo: [
        "Open the tool and wait a moment while it reads the available values.",
        "Review the cards for screen, viewport, language, timezone and other facts.",
        "Click Refresh values if you change a browser setting or resize the window.",
        "Copy or download the report if you want a local record of the values.",
      ],
      example:
        "A laptop in Berlin might show language en-GB, platform Win32, a 1920 × 1080 screen, a 1440 × 800 viewport, timezone Europe/Berlin and a UTC+02:00 offset in summer.",
      benefits: [
        "Learn which details ordinary web pages can read about your setup.",
        "Check that your language and timezone are reported as expected.",
        "Understand that screen size and platform values can be approximate.",
        "Verify the privacy claim yourself: the page makes no outbound requests.",
      ],
      faqs: [
        {
          q: "Is any of this information sent to a server?",
          a: "No. The values are read with browser APIs and rendered in this page only. There is no form submission, analytics call or storage involved.",
        },
        {
          q: "Why is the screen size not my monitor's real size?",
          a: "Browsers report the available screen dimensions in CSS pixels, which can differ from physical pixels and may exclude taskbars. The device pixel ratio card helps explain the difference.",
        },
        {
          q: "What does 'Device memory' mean?",
          a: "It is a coarse, approximate figure that some browsers expose to help sites choose asset sizes. Many browsers omit it entirely, in which case the tool shows Unavailable.",
        },
        {
          q: "Can these values be used to fingerprint me?",
          a: "Combinations of such values can be somewhat identifying. That is why the tool shows exactly what is readable and notes which fields browsers may round, freeze or spoof.",
        },
      ],
    },
  },
  {
    slug: "http-status-reference",
    title: "HTTP Status Code Reference",
    description:
      "Search a compact reference of common HTTP status codes with original plain-language explanations, filterable by 1xx to 5xx class and fully copyable.",
    category: "security-privacy",
    keywords: ["HTTP status codes", "status code reference", "404 meaning", "HTTP error codes", "redirect codes", "API status codes"],
    icon: "Search",
    status: "ready",
    popularity: 76,
    addedAt: "2026-11-22",
    related: ["network-port-reference", "url-encoder-decoder", "user-agent-parser", "json-formatter"],
    content: {
      what: "The HTTP Status Code Reference is a searchable list of the response codes you are most likely to meet while browsing or debugging an API. Each entry has a short, original explanation of what the code means and when it appears. You can filter by the five status classes, search by number or keyword, and copy or download exactly the codes currently visible.",
      howTo: [
        "Type a number, name or word such as 404, redirect or timeout in the search box.",
        "Optionally narrow the list to a class like 4xx — Client error.",
        "Scan the matching rows for the code, its name and its explanation.",
        "Copy or download the visible list for later reference.",
      ],
      example:
        "Searching for 429 shows Too Many Requests: the client has sent too many requests in a short period and the response often includes a Retry-After header.",
      benefits: [
        "Look up unfamiliar codes without leaving the page.",
        "Plain-language explanations avoid dense specification wording.",
        "Filter by class to study success, redirect or error codes in groups.",
        "Copy the filtered results as a compact text cheat sheet.",
      ],
      faqs: [
        {
          q: "Does this list contain every HTTP status code?",
          a: "No. It covers the common codes defined by the HTTP standards plus a few widely used WebDAV and extension codes. Rare or vendor-specific codes are intentionally left out.",
        },
        {
          q: "What is the difference between 301 and 308?",
          a: "Both signal a permanent move, but 301 allows a client to change the request method to GET while 308 requires the original method to be preserved. For most page moves the practical result is the same.",
        },
        {
          q: "Why do 401 and 403 both concern access?",
          a: "A 401 means authentication is missing or invalid and may succeed after you log in. A 403 means the server refuses the request regardless of who you are.",
        },
        {
          q: "Is 418 a real code I should use?",
          a: "It is officially defined as a joke in an old April Fools' RFC. It is fine as an easter egg but should never be part of a real application's error handling.",
        },
      ],
    },
  },
  {
    slug: "network-port-reference",
    title: "Network Port Reference",
    description:
      "Look up common TCP and UDP port numbers with original service descriptions, searchable by port, name or keyword and filterable by transport protocol.",
    category: "security-privacy",
    keywords: ["network ports", "port numbers", "TCP UDP ports", "well known ports", "port reference", "service ports"],
    icon: "Link2",
    status: "ready",
    popularity: 73,
    addedAt: "2026-11-22",
    related: ["ip-subnet-calculator", "http-status-reference", "browser-information", "regex-tester"],
    content: {
      what: "The Network Port Reference is a searchable table of well-known TCP and UDP ports such as 22 for SSH, 53 for DNS, 443 for HTTPS and 3306 for MySQL. Each row includes the service name, the transport protocol it normally uses and a short original description of its role. Filter by protocol or search by number, name or keyword, then copy the visible entries.",
      howTo: [
        "Enter a port number, service name or word in the search box.",
        "Choose a transport protocol filter if you only want TCP, UDP or both.",
        "Read the matching rows to see the port, protocol and description.",
        "Copy or download the visible list for a quick cheat sheet.",
      ],
      example:
        "Searching for 443 shows HTTPS over TCP: web traffic protected by TLS, the secure counterpart to the plain HTTP service on port 80.",
      benefits: [
        "Recall common port assignments without memorising a long list.",
        "See at a glance whether a service typically uses TCP, UDP or both.",
        "Understand that port numbers are conventions that admins can change.",
        "Copy the filtered results directly into notes or documentation.",
      ],
      faqs: [
        {
          q: "Does an open port mean a service is insecure?",
          a: "Not by itself. A port being open simply means something is listening. Security depends on what the service is, how it is configured and whether it is exposed to untrusted networks.",
        },
        {
          q: "Why do some services list both TCP and UDP?",
          a: "Protocols such as DNS use UDP for quick, small queries and TCP for larger responses or zone transfers, so both transports are associated with the same port number.",
        },
        {
          q: "Can a service run on a different port?",
          a: "Yes. The listed numbers are conventional defaults. Administrators routinely move services to other ports, so a port number alone never proves which application is behind it.",
        },
        {
          q: "Does this tool scan my computer or network?",
          a: "No. It is a static reference list held in the page. It makes no connections and cannot tell you which ports are open on your device.",
        },
      ],
    },
  },
];
