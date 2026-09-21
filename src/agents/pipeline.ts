import type { IngestedContent } from "../ingestion/types";
import type { PipelineResult } from "./types";
import { runThoth } from "./thoth";
import { runAnansi } from "./anansi";
import { runProducer } from "./producer";
import { runLedger } from "./ledger";

/**
 * Runs the four Command Center agents in sequence, each stage consuming the
 * previous stage's structured output:
 *   THOTH (research) -> ANANSI (opportunity/angle) -> PRODUCER (script)
 *   -> LEDGER (monetization/performance metadata)
 *
 * Retries/backoff are applied per-job by the caller (see
 * src/services/pipelineJobService.ts), not inside this function, so a
 * failure partway through a run is retried as a whole rather than resuming
 * mid-pipeline with stale intermediate state.
 */
export async function runAnalysisPipeline(content: IngestedContent): Promise<PipelineResult> {
  const thoth = await runThoth(content);
  const anansi = await runAnansi(content, thoth);
  const producer = await runProducer(thoth, anansi);
  const ledger = await runLedger(anansi, producer);

  return { thoth, anansi, producer, ledger };
}
