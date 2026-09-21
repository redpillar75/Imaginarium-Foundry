import { ApiError } from "../errors";

const SHORTCODE_PATTERN = /\/(p|reel|tv)\/([A-Za-z0-9_-]+)/;

/**
 * Produces a canonical form of a saved-post URL used as the dedupe key:
 * lowercase host, strip query/fragment (tracking params like igshid), strip
 * trailing slash, drop www.
 */
export function normalizeInstagramUrl(rawUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    throw ApiError.badRequest(`"${rawUrl}" is not a valid URL`);
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  if (!host.endsWith("instagram.com")) {
    throw ApiError.badRequest("URL must be an instagram.com link");
  }

  const path = parsed.pathname.replace(/\/+$/, "");
  if (!path) {
    throw ApiError.badRequest("URL must reference a specific post, reel, or IGTV video");
  }

  return `https://${host}${path}`;
}

export function extractShortcode(normalizedUrl: string): string | null {
  const match = normalizedUrl.match(SHORTCODE_PATTERN);
  return match ? match[2] : null;
}
