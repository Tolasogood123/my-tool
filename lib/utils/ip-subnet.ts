/** Pure IPv4 CIDR / subnet mathematics. No React and no browser APIs. */

export interface SubnetResult {
  input: string;
  address: string;
  prefix: number;
  subnetMask: string;
  wildcardMask: string;
  maskBinary: string;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalAddresses: number;
  usableHosts: number;
  addressClass: string;
  isPrivate: boolean;
  hostBitsSet: boolean;
}

export type SubnetOutcome =
  | { error: string; result: null }
  | { error: null; result: SubnetResult };

type CidrParts = { error: string } | { octets: number[]; prefix: number };

const CIDR_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?:\/(\d{1,2}))?$/;

export const SUBNET_EXAMPLES = [
  "192.168.1.0/24",
  "10.0.0.1/8",
  "172.16.5.130/26",
  "203.0.113.42/32",
];

function toUnsigned(value: number): number {
  return value >>> 0;
}

function octetsToInt(octets: number[]): number {
  return toUnsigned(
    (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3],
  );
}

function intToOctets(value: number): number[] {
  const n = toUnsigned(value);
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
}

function octetsToIp(octets: number[]): string {
  return octets.join(".");
}

/** Validates dotted IPv4 notation with an optional /0–/32 prefix. */
export function parseCidr(input: string): CidrParts {
  const trimmed = input.trim();
  if (!trimmed) {
    return { error: "Enter an IPv4 address in CIDR notation, for example 192.168.1.0/24." };
  }

  const match = CIDR_RE.exec(trimmed);
  if (!match) {
    return { error: "Use dotted IPv4 form with four octets and an optional prefix, like 10.0.0.1/8." };
  }

  const octets = [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
  for (const octet of octets) {
    if (octet > 255) {
      return { error: `Octet "${octet}" is out of range. Every IPv4 octet must be between 0 and 255.` };
    }
  }

  const prefixText = match[5];
  const prefix = prefixText === undefined ? 32 : Number(prefixText);
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
    return { error: `/${prefixText} is not a valid prefix. The prefix must be a whole number from 0 to 32.` };
  }

  return { octets, prefix };
}

function describeClass(first: number): string {
  if (first === 0) return "Reserved (0.x)";
  if (first <= 126) return "Class A";
  if (first === 127) return "Loopback (127.x)";
  if (first <= 191) return "Class B";
  if (first <= 223) return "Class C";
  if (first <= 239) return "Class D (multicast)";
  return "Class E (experimental)";
}

function isPrivateAddress(octets: number[]): boolean {
  const [a, b] = octets;
  return (
    a === 10 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a === 127 ||
    (a === 169 && b === 254)
  );
}

/** Computes the network, broadcast, host range and mask for an IPv4 CIDR block. */
export function calculateSubnet(input: string): SubnetOutcome {
  const parsed = parseCidr(input);
  if ("error" in parsed) return { error: parsed.error, result: null };

  const { octets, prefix } = parsed;
  const addressInt = octetsToInt(octets);
  const mask = prefix === 0 ? 0 : toUnsigned(0xffffffff << (32 - prefix));
  const wildcard = toUnsigned(~mask);
  const network = toUnsigned(addressInt & mask);
  const broadcast = toUnsigned(network | wildcard);

  const totalAddresses = 2 ** (32 - prefix);
  // /32 is a single host route; /31 is a two-endpoint point-to-point link (RFC 3021).
  const usableHosts = prefix >= 32 ? 1 : prefix === 31 ? 2 : Math.max(totalAddresses - 2, 0);
  const firstHostInt = prefix >= 31 ? network : toUnsigned(network + 1);
  const lastHostInt = prefix >= 31 ? broadcast : toUnsigned(broadcast - 1);

  const maskBinary = intToOctets(mask)
    .map((octet) => octet.toString(2).padStart(8, "0"))
    .join(".");

  const result: SubnetResult = {
    input: input.trim(),
    address: octetsToIp(octets),
    prefix,
    subnetMask: octetsToIp(intToOctets(mask)),
    wildcardMask: octetsToIp(intToOctets(wildcard)),
    maskBinary,
    networkAddress: octetsToIp(intToOctets(network)),
    broadcastAddress: octetsToIp(intToOctets(broadcast)),
    firstHost: octetsToIp(intToOctets(firstHostInt)),
    lastHost: octetsToIp(intToOctets(lastHostInt)),
    totalAddresses,
    usableHosts,
    addressClass: describeClass(octets[0]),
    isPrivate: isPrivateAddress(octets),
    hostBitsSet: (addressInt & wildcard) !== 0,
  };

  return { error: null, result };
}

/** Human-readable report suitable for copying or downloading. */
export function formatSubnetReport(result: SubnetResult): string {
  return [
    `CIDR: ${result.input}`,
    `Address class: ${result.addressClass}`,
    `Scope: ${result.isPrivate ? "Private / special-use" : "Public / global"}`,
    "",
    `Subnet mask:        ${result.subnetMask}`,
    `Wildcard mask:      ${result.wildcardMask}`,
    `Mask (binary):      ${result.maskBinary}`,
    `Network address:    ${result.networkAddress}`,
    `Broadcast address:  ${result.broadcastAddress}`,
    `First usable host:  ${result.firstHost}`,
    `Last usable host:   ${result.lastHost}`,
    `Total addresses:    ${result.totalAddresses.toLocaleString("en-US")}`,
    `Usable hosts:       ${result.usableHosts.toLocaleString("en-US")}`,
    "",
    result.hostBitsSet
      ? "Note: host bits were set in the input; the network address above masks them off."
      : "Note: the input is the network address with no host bits set.",
    "Subnetting is computed locally with 32-bit IPv4 arithmetic.",
  ].join("\n");
}
