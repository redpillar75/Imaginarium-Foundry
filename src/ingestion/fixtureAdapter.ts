import type { IngestedContent, IngestionAdapter } from "./types";
import { extractShortcode, normalizeInstagramUrl } from "./urlNormalization";

/**
 * Deterministic adapter used in local development/tests and by the
 * INGESTION_ADAPTER=fixture setting, so the pipeline can be exercised
 * end-to-end without live network access.
 */
export class FixtureIngestionAdapter implements IngestionAdapter {
  readonly name = "fixture";

  async fetchContent(sourceUrl: string): Promise<IngestedContent> {
    const normalizedUrl = normalizeInstagramUrl(sourceUrl);
    const shortcode = extractShortcode(normalizedUrl);

    return {
      sourceUrl,
      normalizedUrl,
      shortcode,
      caption: `[fixture caption for ${shortcode ?? "unknown"}]`,
      authorHandle: "fixture.creator",
      mediaType: "video.other",
      metadata: { fixture: true },
    };
  }
}
