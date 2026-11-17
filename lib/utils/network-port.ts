/** A searchable reference of common TCP and UDP port numbers. */

export interface NetworkPort {
  port: number;
  service: string;
  protocol: "TCP" | "UDP" | "TCP/UDP";
  description: string;
}

/** Original, plain-language descriptions of widely used ports. */
export const NETWORK_PORTS: NetworkPort[] = [
  { port: 20, service: "FTP data", protocol: "TCP", description: "Carries the file contents for active-mode FTP transfers." },
  { port: 21, service: "FTP control", protocol: "TCP", description: "Carries FTP commands and replies on a separate connection." },
  { port: 22, service: "SSH / SFTP", protocol: "TCP", description: "Encrypted remote login and secure file transfer." },
  { port: 23, service: "Telnet", protocol: "TCP", description: "Unencrypted remote terminal access; largely obsolete." },
  { port: 25, service: "SMTP", protocol: "TCP", description: "Sends email between mail servers across the internet." },
  { port: 53, service: "DNS", protocol: "TCP/UDP", description: "Resolves human-readable hostnames into IP addresses." },
  { port: 67, service: "DHCP server", protocol: "UDP", description: "Hands out IP addresses and network settings to clients." },
  { port: 68, service: "DHCP client", protocol: "UDP", description: "Used by devices to request an address from a DHCP server." },
  { port: 69, service: "TFTP", protocol: "UDP", description: "A minimal file transfer protocol without authentication." },
  { port: 80, service: "HTTP", protocol: "TCP", description: "Serves ordinary unencrypted web pages and resources." },
  { port: 110, service: "POP3", protocol: "TCP", description: "Downloads email from a mail server to a client." },
  { port: 119, service: "NNTP", protocol: "TCP", description: "Distributes Usenet newsgroup articles to subscribers." },
  { port: 123, service: "NTP", protocol: "UDP", description: "Synchronises device clocks with time servers." },
  { port: 135, service: "MS RPC", protocol: "TCP/UDP", description: "Microsoft's remote procedure call endpoint mapper." },
  { port: 139, service: "NetBIOS", protocol: "TCP/UDP", description: "Legacy Windows name and session sharing service." },
  { port: 143, service: "IMAP", protocol: "TCP", description: "Lets email clients read and sync messages on a server." },
  { port: 161, service: "SNMP", protocol: "UDP", description: "Reads management data from routers, switches and servers." },
  { port: 162, service: "SNMP traps", protocol: "UDP", description: "Delivers unsolicited alerts from network devices." },
  { port: 179, service: "BGP", protocol: "TCP", description: "Exchanges routing information between internet routers." },
  { port: 389, service: "LDAP", protocol: "TCP/UDP", description: "Queries directory services such as user accounts." },
  { port: 443, service: "HTTPS", protocol: "TCP", description: "Serves web traffic encrypted with TLS." },
  { port: 445, service: "SMB", protocol: "TCP", description: "Shares files and printers on modern Windows networks." },
  { port: 465, service: "SMTPS", protocol: "TCP", description: "Legacy implicit-TLS port for sending email." },
  { port: 514, service: "Syslog", protocol: "UDP", description: "Collects log messages from network devices." },
  { port: 587, service: "SMTP submission", protocol: "TCP", description: "The standard port for clients submitting mail with TLS." },
  { port: 631, service: "IPP / CUPS", protocol: "TCP", description: "Carries network printing jobs to printers and print servers." },
  { port: 636, service: "LDAPS", protocol: "TCP", description: "Directory queries protected by TLS encryption." },
  { port: 993, service: "IMAPS", protocol: "TCP", description: "IMAP email access wrapped in TLS." },
  { port: 995, service: "POP3S", protocol: "TCP", description: "POP3 email retrieval wrapped in TLS." },
  { port: 1080, service: "SOCKS proxy", protocol: "TCP", description: "A generic proxy protocol that relays many kinds of traffic." },
  { port: 1433, service: "Microsoft SQL Server", protocol: "TCP", description: "Default listener for SQL Server database connections." },
  { port: 1521, service: "Oracle DB", protocol: "TCP", description: "Default listener for Oracle database clients." },
  { port: 2049, service: "NFS", protocol: "TCP/UDP", description: "Shares filesystems across Unix-like systems." },
  { port: 3306, service: "MySQL", protocol: "TCP", description: "Default port for MySQL database connections." },
  { port: 3389, service: "RDP", protocol: "TCP", description: "Microsoft's graphical remote desktop protocol." },
  { port: 5060, service: "SIP", protocol: "TCP/UDP", description: "Sets up and manages voice and video calls." },
  { port: 5432, service: "PostgreSQL", protocol: "TCP", description: "Default port for PostgreSQL database connections." },
  { port: 5900, service: "VNC", protocol: "TCP", description: "Remote graphical desktop sharing, often via RFB." },
  { port: 6379, service: "Redis", protocol: "TCP", description: "In-memory data store used as a cache or message broker." },
  { port: 6443, service: "Kubernetes API", protocol: "TCP", description: "Secure endpoint for the Kubernetes control plane." },
  { port: 6667, service: "IRC", protocol: "TCP", description: "Traditional text-based internet relay chat." },
  { port: 8080, service: "HTTP alternate", protocol: "TCP", description: "Common port for proxy servers and development web servers." },
  { port: 8443, service: "HTTPS alternate", protocol: "TCP", description: "Frequently used for admin panels and TLS development servers." },
  { port: 9200, service: "Elasticsearch", protocol: "TCP", description: "HTTP interface for the Elasticsearch search engine." },
  { port: 27017, service: "MongoDB", protocol: "TCP", description: "Default port for MongoDB database connections." },
];

export type PortProtocolFilter = "all" | "TCP" | "UDP" | "TCP/UDP";

/** Filters ports by number, service name, description and transport protocol. */
export function filterNetworkPorts(
  query: string,
  protocol: PortProtocolFilter,
): NetworkPort[] {
  const needle = query.trim().toLowerCase();
  return NETWORK_PORTS.filter((item) => {
    if (protocol === "TCP" && !item.protocol.includes("TCP")) return false;
    if (protocol === "UDP" && !item.protocol.includes("UDP")) return false;
    if (protocol === "TCP/UDP" && item.protocol !== "TCP/UDP") return false;
    if (!needle) return true;
    return (
      String(item.port).includes(needle) ||
      item.service.toLowerCase().includes(needle) ||
      item.description.toLowerCase().includes(needle)
    );
  });
}

/** Human-readable, copyable list of the supplied ports. */
export function formatNetworkPorts(items: NetworkPort[]): string {
  if (items.length === 0) return "No ports match the current filters.";
  return items
    .map((item) => `${item.port}/${item.protocol}  ${item.service} — ${item.description}`)
    .join("\n");
}
