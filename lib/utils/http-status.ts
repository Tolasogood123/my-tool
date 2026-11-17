/** A small, searchable reference of common HTTP response status codes. */

export interface HttpStatus {
  code: number;
  name: string;
  explanation: string;
}

/** Original, plain-language explanations of the codes you meet most often. */
export const HTTP_STATUS_CODES: HttpStatus[] = [
  { code: 100, name: "Continue", explanation: "The server has received the request headers and is waiting for the rest of the body. The client should go ahead and send it." },
  { code: 101, name: "Switching Protocols", explanation: "The server agrees to change protocols, usually to upgrade a connection to WebSocket. The switch happens immediately after this response." },
  { code: 102, name: "Processing", explanation: "The request was accepted but has not finished yet. It tells a client not to time out while a slow operation continues." },
  { code: 103, name: "Early Hints", explanation: "The server sends hints about resources the page will need before the final response is ready, so the browser can start fetching them sooner." },

  { code: 200, name: "OK", explanation: "The request succeeded and the response body contains the requested resource. This is the status most people expect from a healthy page." },
  { code: 201, name: "Created", explanation: "A new resource was made successfully, often in response to a POST request. The response usually points to where the new resource lives." },
  { code: 202, name: "Accepted", explanation: "The request was received but not completed yet. It is commonly used for background jobs that will finish at some later point." },
  { code: 203, name: "Non-Authoritative Information", explanation: "The returned metadata came from a cached or third-party copy rather than the original server. The content itself is still usable." },
  { code: 204, name: "No Content", explanation: "The request succeeded but there is deliberately no response body. It is a common reply to a successful delete or a silent update." },
  { code: 205, name: "Reset Content", explanation: "The action succeeded and the client should reset the view or form it was using. It is rarely seen outside older form workflows." },
  { code: 206, name: "Partial Content", explanation: "Only part of the resource was returned, as requested with a byte range. Video streaming and download resumers rely on this status." },
  { code: 207, name: "Multi-Status", explanation: "A single response carries results for several separate operations, each with its own status. WebDAV uses it for batch requests." },
  { code: 208, name: "Already Reported", explanation: "Used inside a multi-status reply to say a resource was already described earlier, avoiding duplicate entries in the response." },
  { code: 226, name: "IM Used", explanation: "The server applied an instance manipulation to the resource and returned the result. It is part of an old, rarely used delta-encoding extension." },

  { code: 300, name: "Multiple Choices", explanation: "The resource has several possible representations and the client must choose one. Browsers rarely surface this to users directly." },
  { code: 301, name: "Moved Permanently", explanation: "The resource has a new permanent address and future requests should use it. Search engines transfer ranking signals to the new URL." },
  { code: 302, name: "Found", explanation: "The resource is temporarily at a different address. Clients should keep using the original URL for later requests." },
  { code: 303, name: "See Other", explanation: "The response is at a different URL and should be fetched with a GET request. It is often used after form submissions." },
  { code: 304, name: "Not Modified", explanation: "The cached copy is still current, so the server sends no body. The browser reuses what it already stored, saving bandwidth." },
  { code: 305, name: "Use Proxy", explanation: "The resource must be accessed through the proxy named in the response. This status is deprecated and almost never used today." },
  { code: 307, name: "Temporary Redirect", explanation: "The resource lives elsewhere for now, and the client should repeat the same method at the new URL. Unlike 302, the method must not change." },
  { code: 308, name: "Permanent Redirect", explanation: "The resource has moved for good and the same method should be used at the new address. Unlike 301, the method is guaranteed to stay unchanged." },

  { code: 400, name: "Bad Request", explanation: "The server cannot make sense of the request, usually because of malformed syntax or invalid parameters. Fix the request before retrying." },
  { code: 401, name: "Unauthorized", explanation: "Authentication is required and has not been supplied or accepted. A valid login or token is needed before access is granted." },
  { code: 402, name: "Payment Required", explanation: "Reserved for cases where payment is needed to proceed. It is rarely used by public websites, which prefer their own flows." },
  { code: 403, name: "Forbidden", explanation: "The server understood the request but refuses to authorise it. Unlike 401, logging in again will not necessarily help." },
  { code: 404, name: "Not Found", explanation: "The requested resource does not exist at that address. It may have been removed, renamed, or the URL may simply be wrong." },
  { code: 405, name: "Method Not Allowed", explanation: "The resource exists but does not support the HTTP method used. The response normally lists which methods are permitted." },
  { code: 406, name: "Not Acceptable", explanation: "The server cannot produce a response matching the formats the client said it would accept. It is uncommon in everyday browsing." },
  { code: 407, name: "Proxy Authentication Required", explanation: "A proxy between the client and the server requires credentials before it will forward the request. The client must authenticate to the proxy." },
  { code: 408, name: "Request Timeout", explanation: "The server waited too long for the client to finish sending the request. It may happen on very slow or unreliable connections." },
  { code: 409, name: "Conflict", explanation: "The request clashes with the current state of the resource, such as editing a file someone else has already changed. The client should resolve the conflict first." },
  { code: 410, name: "Gone", explanation: "The resource used to exist but has been deliberately removed and will not return. Clients should stop trying that address." },
  { code: 411, name: "Length Required", explanation: "The server needs a Content-Length header to process the request and the client did not send one." },
  { code: 412, name: "Precondition Failed", explanation: "One of the conditions set by the client, such as an If-Match header, was not met. The resource was likely changed in the meantime." },
  { code: 413, name: "Payload Too Large", explanation: "The request body is bigger than the server is willing to handle. Uploading a smaller file or compressing the data usually fixes it." },
  { code: 414, name: "URI Too Long", explanation: "The URL is longer than the server will accept. This often happens when too much data is packed into query parameters." },
  { code: 415, name: "Unsupported Media Type", explanation: "The server does not understand the format of the request body, so the payload cannot be processed." },
  { code: 416, name: "Range Not Satisfiable", explanation: "The client asked for a byte range the resource cannot provide, usually because the starting point is past the end of the file." },
  { code: 417, name: "Expectation Failed", explanation: "The server could not meet an expectation the client set in an Expect header. It is mainly seen with the older Expect: 100-continue pattern." },
  { code: 418, name: "I'm a Teapot", explanation: "A playful code from an April Fools' specification about brewing coffee in teapots. It is not meant for real applications, though some servers keep it as an easter egg." },
  { code: 422, name: "Unprocessable Content", explanation: "The request was well formed but the contents were invalid, such as a form that fails validation. It is widely used by APIs for field errors." },
  { code: 423, name: "Locked", explanation: "The target resource is locked and cannot be modified. WebDAV uses it when a file is checked out or held by another user." },
  { code: 424, name: "Failed Dependency", explanation: "The request failed because an earlier request it depended on also failed. The operation cannot proceed until the prior step succeeds." },
  { code: 425, name: "Too Early", explanation: "The server is not willing to process a request that might be replayed, often to protect against certain TLS handshake risks." },
  { code: 426, name: "Upgrade Required", explanation: "The client must switch to a different protocol, typically HTTPS, before the request can be handled." },
  { code: 428, name: "Precondition Required", explanation: "The server insists on a conditional header so that concurrent updates do not overwrite each other. The client must supply one." },
  { code: 429, name: "Too Many Requests", explanation: "The client has sent too many requests in a short period. The response often includes a Retry-After header telling you when to try again." },
  { code: 431, name: "Request Header Fields Too Large", explanation: "The request headers exceed the server's limit. Large cookies or tokens are a frequent cause." },
  { code: 451, name: "Unavailable For Legal Reasons", explanation: "The resource was withheld for legal or policy reasons, such as a government takedown request. The code deliberately echoes the novel it references." },

  { code: 500, name: "Internal Server Error", explanation: "Something went wrong on the server and it could not give a useful response. It usually points to a bug or misconfiguration rather than a client mistake." },
  { code: 501, name: "Not Implemented", explanation: "The server does not support the functionality needed to fulfil the request. It may appear when an unusual HTTP method is used." },
  { code: 502, name: "Bad Gateway", explanation: "A gateway or proxy got an invalid response from an upstream server. The intermediary is working, but the service behind it is not." },
  { code: 503, name: "Service Unavailable", explanation: "The server is temporarily unable to cope, often because it is overloaded or under maintenance. Retrying later usually succeeds." },
  { code: 504, name: "Gateway Timeout", explanation: "A gateway or proxy waited too long for an upstream server to reply. The problem lies beyond the intermediary." },
  { code: 505, name: "HTTP Version Not Supported", explanation: "The server cannot handle the HTTP version used in the request. Switching to a supported version is required." },
  { code: 506, name: "Variant Also Negotiates", explanation: "A transparent content-negotiation configuration has created a loop where a variant points to itself. It is a server configuration problem." },
  { code: 507, name: "Insufficient Storage", explanation: "The server cannot store what is needed to complete the request, typically because its storage quota is full." },
  { code: 508, name: "Loop Detected", explanation: "The server detected an infinite loop while processing the request, often in WebDAV operations that reference each other." },
  { code: 510, name: "Not Extended", explanation: "Further extensions to the request are required before the server will fulfil it. This status is rarely implemented." },
  { code: 511, name: "Network Authentication Required", explanation: "The client must authenticate with the network itself, such as a captive portal at a hotel or café, before it can browse." },
];

export type StatusGroup = "all" | "1xx" | "2xx" | "3xx" | "4xx" | "5xx";

/** Filters the reference by number, name, explanation and status class. */
export function filterHttpStatuses(query: string, group: StatusGroup): HttpStatus[] {
  const needle = query.trim().toLowerCase();
  return HTTP_STATUS_CODES.filter((item) => {
    if (group !== "all" && `${Math.floor(item.code / 100)}xx` !== group) return false;
    if (!needle) return true;
    return (
      String(item.code).includes(needle) ||
      item.name.toLowerCase().includes(needle) ||
      item.explanation.toLowerCase().includes(needle)
    );
  });
}

/** Human-readable, copyable list of the supplied statuses. */
export function formatHttpStatuses(items: HttpStatus[]): string {
  if (items.length === 0) return "No status codes match the current filters.";
  return items
    .map((item) => `${item.code} ${item.name} — ${item.explanation}`)
    .join("\n");
}
