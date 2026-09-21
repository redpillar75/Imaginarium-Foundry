import { callStructuredAgent } from "./anthropicClient";
import type { AgentContext, AnansiOutput, ThothOutput } from "./types";

const SYSTEM_PROMPT = `You are ANANSI, the opportunity-identification agent inside the
Imaginarium Command Center. Given THOTH's research on a saved piece of
content, identify the sharpest content angle: which content pillar it
belongs to, who the audience angle is, and three distinct hook options a
creator could open a video with.`;

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    contentPillar: {
      type: "string",
      description: "The content pillar/category this idea belongs to.",
    },
    audienceAngle: {
      type: "string",
      description: "Who this is for and why they'd care.",
    },
    hookOptions: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 3,
      description: "Exactly three distinct opening hooks for a short-form video.",
    },
  },
  required: ["contentPillar", "audienceAngle", "hookOptions"],
};

export async function runAnansi(context: AgentContext, thoth: ThothOutput): Promise<AnansiOutput> {
  const userPrompt = [
    `Source summary: ${thoth.summary}`,
    `Key topics: ${thoth.keyTopics.join(", ")}`,
    `Original caption: ${context.caption ?? "(no caption available)"}`,
  ].join("\n");

  const result = await callStructuredAgent<{
    contentPillar: string;
    audienceAngle: string;
    hookOptions: string[];
  }>({
    agentName: "ANANSI",
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    outputSchema: OUTPUT_SCHEMA,
  });

  const [first, second, third] = result.hookOptions;
  if (!first || !second || !third) {
    throw new Error("ANANSI must return exactly three hook options");
  }

  return {
    contentPillar: result.contentPillar,
    audienceAngle: result.audienceAngle,
    hookOptions: [first, second, third],
  };
}
