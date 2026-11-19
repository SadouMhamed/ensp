/**
 * Helpers that turn a raw Better Auth session row into readable details
 * (device, browser, IP address, times). No secrets here: safe for client and server.
 */

export type DeviceType = "desktop" | "mobile" | "tablet" | "bot" | "unknown";

export type DeviceInfo = {
  type: DeviceType;
  browser: string | null;
  os: string | null;
  /** Short text for the table, e.g. "Chrome on Windows". */
  label: string;
};

// Order matters: Edge/Opera/Samsung also say "Chrome", Chrome also says "Safari".
const BROWSERS: [RegExp, string][] = [
  [/Edg(?:e|A|iOS)?\/([\d.]+)/, "Edge"],
  [/(?:OPR|Opera)\/([\d.]+)/, "Opera"],
  [/SamsungBrowser\/([\d.]+)/, "Samsung Internet"],
  [/(?:Firefox|FxiOS)\/([\d.]+)/, "Firefox"],
  [/(?:Chrome|CriOS)\/([\d.]+)/, "Chrome"],
  [/Version\/([\d.]+).*Safari\//, "Safari"],
];

const OSES: [RegExp, string][] = [
  [/Windows NT/, "Windows"],
  [/iPhone|iPod/, "iOS"],
  [/iPad/, "iPadOS"],
  [/Android/, "Android"],
  [/CrOS/, "ChromeOS"],
  [/Mac OS X|Macintosh/, "macOS"],
  [/Linux/, "Linux"],
];

const BOT = /bot|crawler|spider|curl|wget|python-requests|node-fetch|undici|postman/i;

/** Reads the browser's "user agent" text and guesses the device, browser and system. */
export function parseUserAgent(userAgent: string | null | undefined): DeviceInfo {
  const ua = userAgent?.trim() ?? "";
  if (!ua) return { type: "unknown", browser: null, os: null, label: "Unknown device" };

  if (BOT.test(ua)) {
    return { type: "bot", browser: null, os: null, label: "Script or bot" };
  }

  const browser = BROWSERS.find(([re]) => re.test(ua))?.[1] ?? null;
  const os = OSES.find(([re]) => re.test(ua))?.[1] ?? null;

  let type: DeviceType = "desktop";
  if (/iPad|Tablet/i.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua))) type = "tablet";
  else if (/Mobi|iPhone|iPod/i.test(ua)) type = "mobile";

  const label =
    browser && os ? `${browser} on ${os}` : (browser ?? os ?? "Unknown device");

  return { type, browser, os, label };
}

/** Makes the IP address easier to read (e.g. "::ffff:1.2.3.4" → "1.2.3.4"). */
export function formatIpAddress(ip: string | null | undefined): string {
  const value = ip?.trim();
  if (!value) return "Unknown";
  const plain = value.replace(/^::ffff:/, "");
  if (plain === "::1" || plain === "127.0.0.1") return "This computer (local)";
  return plain;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "just now", "5 minutes ago", "in 3 days"… */
export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const diff = date.getTime() - now.getTime();
  const abs = Math.abs(diff);
  if (abs < MINUTE) return "just now";
  if (abs < HOUR) return relative.format(Math.round(diff / MINUTE), "minute");
  if (abs < DAY) return relative.format(Math.round(diff / HOUR), "hour");
  if (abs < 30 * DAY) return relative.format(Math.round(diff / DAY), "day");
  return relative.format(Math.round(diff / (30 * DAY)), "month");
}

/** Full date and time in the viewer's own time zone, e.g. "19 Nov 2026, 14:05". */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** Everything the sessions table needs about one session, in one object. */
export function describeSession(
  s: {
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
  },
  now: Date = new Date(),
) {
  return {
    device: parseUserAgent(s.userAgent),
    ip: formatIpAddress(s.ipAddress),
    signedIn: formatRelativeTime(s.createdAt, now),
    lastActive: formatRelativeTime(s.updatedAt, now),
    expires: formatRelativeTime(s.expiresAt, now),
  };
}
