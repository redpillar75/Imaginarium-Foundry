import { callStructuredAgent } from "./anthropicClient";
import type { AgentContext, ThothOutput } from "./types";

const SYSTEM_PROMPT = `You are THOTH, the research and source-analysis agent inside the
Imaginarium Command Center. Given a saved Instagram post's caption and
metadata, analyze what it is actually about and why it might matter to a
creator, without inventing facts that aren't supported by the source.`;

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string", description: "2-4 sentence summary of the source content." },
    keyTopics: {
      type: "array",
      items: { type: "string" },
      description: "3-6 short topic/keyword tags describing the content.",
    },
    researchNotes: {
      type: "object",
      description: "Free-form supporting notes (format, tone, notable claims, etc).",
      additionalProperties: true,
    },
  },
  required: ["summary", "keyTopics", "researchNotes"],
};

export async function runThoth(context: AgentContext): Promise<ThothOutput> {
  const userPrompt = [
    `Source URL: ${context.normalizedUrl}`,
    `Author handle: ${context.authorHandle ?? "unknown"}`,
    `Media type: ${context.mediaType ?? "unknown"}`,
    `Caption: ${context.caption ?? "(no caption available)"}`,
  ].join("\n");

  return callStructuredAgent<ThothOutput>({
    agentName: "THOTH",
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    outputSchema: OUTPUT_SCHEMA,
  });
}
