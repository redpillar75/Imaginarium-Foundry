import type { IngestionAdapter } from "./types";
import { HtmlMetaIngestionAdapter } from "./htmlMetaAdapter";
import { FixtureIngestionAdapter } from "./fixtureAdapter";
import { env } from "../config/env";

export type { IngestedContent, IngestionAdapter } from "./types";
export { normalizeInstagramUrl, extractShortcode } from "./urlNormalization";

const adapters: Record<string, () => IngestionAdapter> = {
  "html-meta": () => new HtmlMetaIngestionAdapter(),
  fixture: () => new FixtureIngestionAdapter(),
};

let cachedAdapter: IngestionAdapter | undefined;

/**
 * Resolves the active ingestion adapter from INGESTION_ADAPTER. Callers
 * (services/routes) depend only on the IngestionAdapter interface, so
 * adding a new source (bulk CSV import, an official Graph API integration,
 * a different social platform) is a matter of registering it here.
 */
export function getIngestionAdapter(): IngestionAdapter {
  if (!cachedAdapter) {
    const factory = adapters[env.INGESTION_ADAPTER];
    if (!factory) {
      throw new Error(
        `Unknown INGESTION_ADAPTER "${env.INGESTION_ADAPTER}". Available: ${Object.keys(adapters).join(", ")}`
      );
    }
    cachedAdapter = factory();
  }
  return cachedAdapter;
}

/** Test-only escape hatch to reset the memoized adapter between test cases. */
export function __resetIngestionAdapterCache(): void {
  cachedAdapter = undefined;
}
