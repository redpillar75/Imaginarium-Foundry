import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env";

let client: Anthropic | undefined;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return client;
}

export interface StructuredAgentCallInput {
  agentName: string;
  systemPrompt: string;
  userPrompt: string;
  /** JSON schema describing the exact shape the agent must return. */
  outputSchema: Record<string, unknown>;
}

/**
 * Calls Claude with a single forced tool-use turn so the response is
 * guaranteed to match `outputSchema` instead of free-form text that would
 * need brittle parsing. Each Command Center agent (THOTH/ANANSI/PRODUCER/
 * LEDGER) is a thin wrapper around this with its own prompt + schema.
 */
export async function callStructuredAgent<T>(input: StructuredAgentCallInput): Promise<T> {
  const toolName = `emit_${input.agentName.toLowerCase()}_output`;

  const response = await getClient().messages.create({
    model: env.ANTHROPIC_MODEL,
    max_tokens: 2048,
    system: input.systemPrompt,
    messages: [{ role: "user", content: input.userPrompt }],
    tools: [
      {
        name: toolName,
        description: `Return the ${input.agentName} agent's structured output.`,
        input_schema: input.outputSchema as Anthropic.Tool.InputSchema,
      },
    ],
    tool_choice: { type: "tool", name: toolName },
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new Error(`Agent ${input.agentName} did not return a structured tool_use response`);
  }

  return toolUse.input as T;
}
