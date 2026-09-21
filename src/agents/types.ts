import type { IngestedContent } from "../ingestion/types";

export interface ThothOutput {
  summary: string;
  keyTopics: string[];
  researchNotes: Record<string, unknown>;
}

export interface AnansiOutput {
  contentPillar: string;
  audienceAngle: string;
  hookOptions: [string, string, string];
}

export interface ProducerOutput {
  shortFormScript: string;
  suggestedPlatform: string;
  productionNotes: Record<string, unknown>;
}

export interface LedgerOutput {
  monetizationTags: string[];
  performanceNotes: Record<string, unknown>;
}

export interface PipelineResult {
  thoth: ThothOutput;
  anansi: AnansiOutput;
  producer: ProducerOutput;
  ledger: LedgerOutput;
}

export type AgentContext = IngestedContent;
