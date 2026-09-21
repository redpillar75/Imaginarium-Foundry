/** Normalized content pulled from a saved Instagram post, regardless of
 * which underlying adapter produced it. */
export interface IngestedContent {
  sourceUrl: string;
  normalizedUrl: string;
  shortcode: string | null;
  caption: string | null;
  authorHandle: string | null;
  mediaType: string | null;
  metadata: Record<string, unknown>;
}

/**
 * Replaceable ingestion boundary. Anything that can turn a saved-post
 * reference into an `IngestedContent` record can implement this — a public
 * metadata scraper (the MVP default), an official Graph API integration, a
 * CSV/bulk importer, or a test fixture. Nothing outside src/ingestion should
 * assume a specific adapter is in use, and no adapter may require storing an
 * Instagram session/login credential.
 */
export interface IngestionAdapter {
  readonly name: string;
  fetchContent(sourceUrl: string): Promise<IngestedContent>;
}
