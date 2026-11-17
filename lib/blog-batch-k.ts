import type { BlogPost } from "@/lib/blog";

/** Batch K guide covering the five IPv4 and browser/privacy tools. */
export const batchKBlogs: BlogPost[] = [
  {
    slug: "network-and-browser-privacy-toolkit",
    title: "A Practical Guide to Network and Browser Privacy Tools",
    description:
      "Learn how IPv4 subnets, port numbers, HTTP status codes and browser fingerprints fit together, and use free browser tools to inspect each one safely.",
    date: "2026-11-22",
    readingMinutes: 8,
    tags: ["Privacy", "Networking", "Security", "Guides"],
    content: `Networking and browser privacy can feel like a subject reserved for specialists. In practice, a handful of everyday concepts explain most of what happens when you open a web page: addresses are divided into subnets, services listen on numbered ports, servers reply with status codes, and your browser quietly shares a few facts about itself. Once you understand those pieces, the "private browsing" claims you read start to make sense. This guide walks through each piece and shows how to inspect it without installing software or sending your data anywhere.

## Why subnets matter

Every device on an IPv4 network has a 32-bit address, written as four numbers such as 192.168.1.24. A subnet mask splits that address into a network portion and a host portion. Devices in the same subnet can talk to each other directly; reaching anything outside requires a router. The CIDR notation you often see, such as /24, is just a compact way of writing the mask: it counts how many leading bits are set.

Getting the split wrong causes real problems. Set a mask too narrow and two machines that should be local start sending traffic to the router. Set it too broad and a device tries to reach neighbours that do not exist. The [IP Subnet Calculator](/tools/ip-subnet-calculator) does the binary work for you: enter a CIDR block and it returns the network address, broadcast address, mask, wildcard mask, first and last usable host, and the number of assignable addresses. Try 192.168.1.130/26 and you will see that the host bits are stripped away to reveal the .128 network.

A useful habit is to sanity-check any address range before you configure a router, firewall rule or VPN split tunnel. The tool validates each octet and the prefix length, so typos like 300.1.1.1 or /33 are caught immediately.

## Ports: the doors services listen on

If an IP address is a street address, a port is the apartment number. There are 65,535 TCP and 65,535 UDP port numbers, and conventions have grown up around the most common ones. Port 80 serves plain web pages, 443 serves encrypted ones, 22 is used for SSH, 53 for DNS and 3306 for MySQL. Knowing these defaults helps you read a firewall rule or a connection error without guesswork.

The [Network Port Reference](/tools/network-port-reference) is a searchable list of the ports you are most likely to encounter. Each entry explains what the service does and whether it normally uses TCP, UDP or both. DNS is a good example of why that distinction matters: quick lookups use UDP, while larger replies fall back to TCP on the same port number.

Remember that port numbers are conventions, not laws. An administrator can move SSH to a different port or run a web service on 8080. An open port is not automatically a vulnerability, but an unexpected one is worth investigating. Use the reference as a starting point for questions, not as proof of what is running on a machine.

## Reading the server's replies

When you request a page, the server answers with a three-digit status code. These codes tell you whether the request worked and, if not, roughly why. They are grouped into five families: 1xx for information, 2xx for success, 3xx for redirection, 4xx for client errors and 5xx for server errors.

Most people meet 404 (Not Found) and 500 (Internal Server Error) sooner or later, but the subtleties are where the value lies. A 401 means authentication is missing and might succeed after you log in, whereas a 403 means the server refuses the request regardless of identity. A 429 tells you that you have sent too many requests and often includes a Retry-After header, which is a hint to slow down rather than hammer the endpoint. The [HTTP Status Code Reference](/tools/http-status-reference) puts short, plain-language explanations of these codes in one searchable place, filterable by class.

Developers and site owners should pay attention to redirects too. A 301 is a permanent move and a 302 is temporary, while 308 guarantees the request method will not change. Choosing the wrong one can quietly damage search rankings or break API clients.

## What your browser reveals about you

Every page you visit can read a surprising amount of information without asking permission. Your preferred languages, platform string, screen and viewport size, colour depth, pixel ratio, time zone and UTC offset are all available through ordinary browser APIs. None of this is an ID number, but unique combinations can narrow you down in a crowd — which is why privacy researchers talk about fingerprinting.

The [Browser Information Checker](/tools/browser-information) shows exactly which values this page can see. It makes no network request and stores nothing, so you can verify the claim yourself. Two details are worth noting. First, the screen size reported is in CSS pixels and may not match your physical monitor, especially on high-density displays; the pixel ratio explains the gap. Second, some fields are deliberately coarse or missing. Device memory, for example, is an approximate hint that many browsers do not expose at all.

Seeing these values is the first step to controlling them. You can change your language order, enable Do Not Track, resize a window or use a browser with anti-fingerprinting features, then refresh the tool to see what changed.

## User-agents: useful, but easily faked

The classic piece of browser information is the user-agent string. It advertises a browser name and version, an engine and an operating system. Applications have used it for decades to decide which features to serve. The catch is that it is entirely self-reported: any browser, extension or script can rewrite it. A crawler can claim to be Chrome, and a privacy tool can make Chrome look like something else.

Paste a string into the [User-Agent Parser](/tools/user-agent-parser) to see how it breaks down into browser, engine, OS and device type, with a check for common bot signatures. You can also load your browser's own value in one click. Treat the output as a claim, not a fact. For deciding whether a feature works, modern developers rely on feature detection instead of reading the UA. The parser is best used to understand what a server sees and to spot obvious automation.

## Putting the pieces together

These topics are connected. A subnet decides which neighbours your device can reach directly. A port decides which service on a host receives a connection. A status code tells you how that service responded. Browser facts and user-agents describe the client that made the request. When a page fails to load, walking through that chain — address, port, response, client — turns a vague "it doesn't work" into a specific question.

The same habit helps with privacy. Before you assume a site knows something about you, ask what it could actually observe. It sees your IP address, the pages you request, the headers your browser sends and the values the page can read locally. If a tool asks you to upload a file or paste sensitive text just to perform a calculation, that is a separate, avoidable disclosure. Every tool in this guide works in your browser alone, with no account and no upload.

## Small habits, better control

You do not need to become a network engineer to benefit from this. Check a CIDR range before changing network settings. Keep a short list of common ports handy when reading firewall logs. Look up an unfamiliar status code instead of guessing. Read your browser's exposed facts once, and decide whether the defaults are comfortable for you. A few minutes with these tools replaces a lot of guesswork — and because they run locally, the investigation itself leaves no trace.`,
  },
];
