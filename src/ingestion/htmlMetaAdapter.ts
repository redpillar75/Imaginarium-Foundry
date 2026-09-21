import type { IngestedContent, IngestionAdapter } from "./types";
import { extractShortcode, normalizeInstagramUrl } from "./urlNormalization";
import { ApiError } from "../errors";
import { env } from "../config/env";

function extractMetaContent(html: string, property: string): string | null {
  const pattern = new RegExp(
    `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["']`,
    "i"
  );
  const match = html.match(pattern);
  return match ? decodeHtmlEntities(match[1]) : null;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractAuthorHandle(html: string, description: string | null): string | null {
  // og:title on Instagram posts is typically `<handle> on Instagram: "..."`.
  const title = extractMetaContent(html, "og:title");
  const fromTitle = title?.match(/^([\w.]+)\s+on Instagram/i);
  if (fromTitle) return fromTitle[1];

  const fromDescription = description?.match(/^([\w.]+)\s+on Instagram/i);
  return fromDescription ? fromDescription[1] : null;
}

/**
 * Default ingestion adapter for the MVP. Fetches the public, unauthenticated
 * HTML of a saved-post URL and extracts Open Graph metadata (caption,
 * media type, thumbnail). It never logs into Instagram and never touches a
 * session/login credential, satisfying the "no Instagram session
 * credentials in source control" requirement by construction — there are
 * none to store.
 *
 * Swappable: any other adapter implementing `IngestionAdapter` can replace
 * this without changing callers (see src/ingestion/index.ts).
 */
export class HtmlMetaIngestionAdapter implements IngestionAdapter {
  readonly name = "html-meta";

  async fetchContent(sourceUrl: string): Promise<IngestedContent> {
    const normalizedUrl = normalizeInstagramUrl(sourceUrl);
    const shortcode = extractShortcode(normalizedUrl);

    const html = await this.fetchHtml(normalizedUrl);

    const description = extractMetaContent(html, "og:description");
    const mediaType = extractMetaContent(html, "og:type");
    const authorHandle = extractAuthorHandle(html, description);

    return {
      sourceUrl,
      normalizedUrl,
      shortcode,
      caption: description,
      authorHandle,
      mediaType,
      metadata: {
        ogTitle: extractMetaContent(html, "og:title"),
        ogImage: extractMetaContent(html, "og:image"),
        fetchedAt: new Date().toISOString(),
      },
    };
  }

  private async fetchHtml(url: string): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), env.INGESTION_FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          // A standard browser UA is required for Instagram to serve the
          // public HTML/meta tags rather than an app-install interstitial.
          "User-Agent":
            "Mozilla/5.0 (compatible; ImaginariumFoundry/1.0; +https://github.com/redpillar75/Imaginarium-Foundry)",
        },
      });

      if (!response.ok) {
        throw ApiError.badRequest(
          `Failed to fetch Instagram post metadata (HTTP ${response.status})`
        );
      }

      return await response.text();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new Error(`Network error fetching "${url}": ${(error as Error).message}`);
    } finally {
      clearTimeout(timeout);
    }
  }
}
