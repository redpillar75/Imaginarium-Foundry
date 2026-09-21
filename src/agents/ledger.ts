import { callStructuredAgent } from "./anthropicClient";
import type { AnansiOutput, LedgerOutput, ProducerOutput } from "./types";

const SYSTEM_PROMPT = `You are LEDGER, the performance-and-monetization agent inside the
Imaginarium Command Center. Given the finished content plan, tag it for
monetization relevance and suggest what performance metrics should be
tracked once it's published.`;

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    monetizationTags: {
      type: "array",
      items: { type: "string" },
      description: "Tags describing monetization relevance (e.g. affiliate, brand-deal-fit, product-launch).",
    },
    performanceNotes: {
      type: "object",
      description: "Suggested KPIs/benchmarks to track post-publish.",
      additionalProperties: true,
    },
  },
  required: ["monetizationTags", "performanceNotes"],
};

export async function runLedger(
  anansi: AnansiOutput,
  producer: ProducerOutput
): Promise<LedgerOutput> {
  const userPrompt = [
    `Content pillar: ${anansi.contentPillar}`,
    `Suggested platform: ${producer.suggestedPlatform}`,
    `Script: ${producer.shortFormScript}`,
  ].join("\n");

  return callStructuredAgent<LedgerOutput>({
    agentName: "LEDGER",
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    outputSchema: OUTPUT_SCHEMA,
  });
}
