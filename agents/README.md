# Agent Layer

Agents are specialized workers coordinated by the workflow orchestrator.

## Initial Agents

- `ingestion` — validate URLs and collect metadata
- `transcript` — retrieve or process transcript content
- `intelligence` — extract themes, claims, and teaching points
- `repurposing` — create hooks, captions, titles, and clip candidates
- `quality` — check traceability, timestamps, warnings, and review requirements
- `orchestrator` — manage state, sequencing, retries, and final results

## Agent Contract

Each agent should receive a structured input and return:

- `status`: `completed`, `blocked`, or `failed`
- `artifacts`: generated outputs
- `warnings`: limitations or uncertainty
- `source_refs`: references to source material where applicable
- `next_action`: the next required workflow step

Agents must not publish content or spend money without an explicit human approval gate.
