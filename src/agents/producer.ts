import { callStructuredAgent } from "./anthropicClient";
import type { AnansiOutput, ProducerOutput, ThothOutput } from "./types";

const SYSTEM_PROMPT = `You are PRODUCER, the production-planning agent inside the
Imaginarium Command Center. Given THOTH's research and ANANSI's chosen
angle/hooks, write a short-form video script and recommend the best
platform to publish it on.`;

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    shortFormScript: {
      type: "string",
      description: "A full short-form (30-90s) video script including the hook.",
    },
    suggestedPlatform: {
      type: "string",
      description: "The single best platform for this content (e.g. Instagram Reels, TikTok, YouTube Shorts).",
    },
    productionNotes: {
      type: "object",
      description: "Shot list notes, pacing, on-screen text cues, etc.",
      additionalProperties: true,
    },
  },
  required: ["shortFormScript", "suggestedPlatform", "productionNotes"],
};

export async function runProducer(
  thoth: ThothOutput,
  anansi: AnansiOutput
): Promise<ProducerOutput> {
  const userPrompt = [
    `Summary: ${thoth.summary}`,
    `Content pillar: ${anansi.contentPillar}`,
    `Audience angle: ${anansi.audienceAngle}`,
    `Hook options:\n${anansi.hookOptions.map((h, i) => `${i + 1}. ${h}`).join("\n")}`,
  ].join("\n");

  return callStructuredAgent<ProducerOutput>({
    agentName: "PRODUCER",
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    outputSchema: OUTPUT_SCHEMA,
  });
}
