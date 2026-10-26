# Graph Report - Imaginarium-Foundry  (2026-10-26)

## Corpus Check
- Corpus is ~32,578 words - fits in a single context window. You may not need a graph.

## Summary
- 359 nodes · 790 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 139 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- YouTube Workflow & MVP Spec
- Foundry Vision & Architecture
- F.A.C.T.S. Network PRD
- Next.js Command Center UI
- API, Agent Runtime & Stack
- Ledge Identity PRD
- FastAPI Workflow Code
- Competitor Intel & Launch Playbook
- PRD & SOP Generators
- TypeScript Config
- TranscriptAPI Skills

## God Nodes (most connected - your core abstractions)
1. `Imaginarium Foundry README` - 51 edges
2. `F.A.C.T.S. Network PRD` - 44 edges
3. `Ledge Identity PRD` - 38 edges
4. `Ledge Identity` - 28 edges
5. `F.A.C.T.S. Network` - 27 edges
6. `YouTube Content Intelligence Workflow` - 20 edges
7. `MVP Specification — YouTube Content Intelligence` - 18 edges
8. `compilerOptions` - 15 edges
9. `YouTube Content Intelligence` - 15 edges
10. `Architecture Overview` - 14 edges

## Surprising Connections (you probably didn't know these)
- `fetch_transcript()` --semantically_similar_to--> `GET /api/v2/youtube/transcript`  [INFERRED] [semantically similar]
  apps/api/app/services/youtube.py → .claude/skills/transcript/SKILL.md
- `analyze_transcript()` --conceptually_related_to--> `Provider-Agnostic AI Adapter Layer`  [AMBIGUOUS]
  apps/api/app/services/intelligence.py → docs/architecture/stack-decision.md
- `F.A.C.T.S. Network PRD (PDF)` --semantically_similar_to--> `F.A.C.T.S. Network PRD`  [INFERRED] [semantically similar]
  prd_outputs/FACTS Network/facts_network_PRD.pdf → prd_outputs/FACTS Network/facts_network_PRD.md
- `Ledge Identity PRD (PDF)` --semantically_similar_to--> `Ledge Identity PRD`  [INFERRED] [semantically similar]
  prd_outputs/Ledge Identity/ledge_identity_PRD.pdf → prd_outputs/Ledge Identity/ledge_identity_PRD.md
- `validate_youtube_url()` --implements--> `Ingestion Agent`  [INFERRED]
  apps/api/app/main.py → workflows/youtube-content-intelligence.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Foundry System Architecture Pipeline** — readme_human_creative_direction, readme_signal_intake, readme_intelligence_layer, readme_agent_workforce, readme_creative_foundry, readme_business_engine, readme_feedback_loop [EXTRACTED 1.00]
- **Agent Operating Loop Layers** — readme_signal_intake, readme_sensor_layer, readme_interpretation_layer, readme_decision_layer, readme_action_layer, readme_observation_layer, readme_value_layer, readme_feedback_loop [EXTRACTED 1.00]
- **YouTube Workflow Agent Team** — workflows_youtube_content_intelligence_ingestion_agent, workflows_youtube_content_intelligence_transcript_agent, workflows_youtube_content_intelligence_intelligence_agent, workflows_youtube_content_intelligence_repurposing_agent, workflows_youtube_content_intelligence_quality_agent, workflows_youtube_content_intelligence_orchestrator [EXTRACTED 1.00]
- **Founder Skills Suite (FOUNDER_CONTEXT-aware)** — claude_skills_competitor_intel_skill_competitor_intel, claude_skills_sop_creator_skill_sop_creator, claude_skills_prd_generator_skill_prd_generator, claude_skills_product_hunt_launch_plan_skill_product_hunt_launch_plan, claude_skills_competitor_intel_skill_founder_context [INFERRED 0.85]
- **F.A.C.T.S. Trust & Safety Layer** — prd_outputs_facts_network_facts_network_prd_trust_verification, prd_outputs_facts_network_facts_network_prd_verification_levels, prd_outputs_facts_network_facts_network_prd_prohibited_content_policy, prd_outputs_facts_network_facts_network_prd_safety_case, prd_outputs_facts_network_facts_network_prd_moderation_provider, prd_outputs_facts_network_facts_network_prd_fail_closed_moderation, prd_outputs_facts_network_facts_network_prd_admin_console [EXTRACTED 1.00]
- **Ledge Credit Economy** — prd_outputs_ledge_identity_ledge_identity_prd_credit_wallet, prd_outputs_ledge_identity_ledge_identity_prd_subscriptions_packs, prd_outputs_ledge_identity_ledge_identity_prd_referral_rewards, prd_outputs_ledge_identity_ledge_identity_prd_identity_generation, prd_outputs_ledge_identity_ledge_identity_prd_idempotency_keys, prd_outputs_facts_network_facts_network_prd_stripe [EXTRACTED 1.00]
- **Ledge Identity Lifecycle (Consent → Deletion)** — prd_outputs_ledge_identity_ledge_identity_prd_account_age_gate, prd_outputs_ledge_identity_ledge_identity_prd_likeness_consent, prd_outputs_ledge_identity_ledge_identity_prd_photo_validation, prd_outputs_ledge_identity_ledge_identity_prd_identity_creation, prd_outputs_ledge_identity_ledge_identity_prd_identity_profile, prd_outputs_ledge_identity_ledge_identity_prd_moderation_deletion, prd_outputs_ledge_identity_ledge_identity_prd_deletion_state_machine [EXTRACTED 1.00]
- **Shared PRD SaaS Stack (Clerk, Stripe, Postgres, BullMQ)** — prd_outputs_facts_network_facts_network_prd_clerk, prd_outputs_facts_network_facts_network_prd_stripe, prd_outputs_facts_network_facts_network_prd_postgis, prd_outputs_facts_network_facts_network_prd_bullmq, prd_outputs_facts_network_facts_network_prd, prd_outputs_ledge_identity_ledge_identity_prd [INFERRED 0.85]
- **YouTube Workflow Code Path (FastAPI)** — apps_api_app_main_run_youtube_workflow, apps_api_app_main_process_youtube_job, apps_api_app_main_validate_youtube_url, apps_api_app_services_youtube_fetch_transcript, apps_api_app_services_intelligence_analyze_transcript [INFERRED 0.95]

## Communities (13 total, 2 thin omitted)

### Community 0 - "YouTube Workflow & MVP Spec"
Cohesion: 0.09
Nodes (38): Agent Layer README, test_youtube_workflow_rejects_non_youtube_url(), MVP Specification — YouTube Content Intelligence, Agent Registry View, All-in-One AI Command Center (Product Vision), Content Intelligence Agent, MVP Core Workflow (URL → Feedback), Dashboard View (+30 more)

### Community 1 - "Foundry Vision & Architecture"
Cohesion: 0.10
Nodes (38): Agent Swarms, Future Expansion (Grant Writing, Pitch Decks, Agent Swarms, Marketplace), Imaginarium Foundry README, Action Layer, Agent Operating Loop, Agent Workforce, Business Agents, Business Engine (+30 more)

### Community 2 - "F.A.C.T.S. Network PRD"
Cohesion: 0.13
Nodes (36): F.A.C.T.S. Network PRD, Admin Console (FACTS), 3D, AR and Video Galleries for Art (FR-020, P2), Audit Event Log (FACTS), Booking for Shelter & Transportation (FR-019, P2), Redis + BullMQ Workers, Clerk Authentication, Closed Alpha: 200 Households / 100 Vendors (+28 more)

### Community 3 - "Next.js Command Center UI"
Cohesion: 0.07
Nodes (32): metadata, Home(), Stage, WorkflowResult, dependencies, next@^15.0.0, react@^19.0.0, react-dom@^19.0.0 (+24 more)

### Community 4 - "API, Agent Runtime & Stack"
Cohesion: 0.08
Nodes (27): Agent Contract (status / artifacts / warnings / source_refs / next_action), API Service README, Imaginarium API Service, POST /v1/workflows/youtube-content-intelligence/runs (planned), API Python Requirements, fastapi / uvicorn / pydantic dependencies, openai SDK dependency, youtube-transcript-api dependency (+19 more)

### Community 5 - "Ledge Identity PRD"
Cohesion: 0.16
Nodes (31): Ledge Identity PRD, Account & 18+ Age Gate (FR-001), Audit Event Log (Ledge), Biometric Privacy Compliance (BIPA, CUBI, GDPR), Brand Kits (FR-016, P2), Brand Operator Persona, Collaborator Access (FR-017, P2), Creative Collaborator Persona (post-MVP) (+23 more)

### Community 6 - "FastAPI Workflow Code"
Cohesion: 0.10
Nodes (13): get_workflow(), health(), initial_stages(), process_youtube_job(), run_youtube_workflow(), set_stage(), validate_youtube_url(), WorkflowRequest (+5 more)

### Community 7 - "Competitor Intel & Launch Playbook"
Cohesion: 0.14
Nodes (24): competitor-intel Skill, Competitor Intel Skill, FOUNDER_CONTEXT.md Business Context, Information Gaps Section, Three Leverage Strategies from Verified Weaknesses, Mandatory Web Research Across Crunchbase, LinkedIn, G2, Similarweb…, Predicted Next Moves from Hiring/Funding Signals, Ultimate Guide to Rank #1 on Product Hunt (+16 more)

### Community 8 - "PRD & SOP Generators"
Cohesion: 0.17
Nodes (14): PRD Template Structure, 15-Section PRD Template, P0 / P1 / P2 Priority Definitions, prd-generator Skill, AI-Ready PRD (Markdown → PDF via md-to-pdf), Clarifying Questions Capped at 7, PRD Generator Skill, prd_outputs/[Project Name]/ Output Folder (+6 more)

### Community 9 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 10 - "TranscriptAPI Skills"
Cohesion: 0.29
Nodes (14): transcript curl Examples, transcript Skill, 1 Credit per Request, 100 Free Credits, GET /api/v2/youtube/transcript, Transcript Skill, TranscriptAPI.com, Required User-Agent Header (Cloudflare), youtube-search curl Examples (+6 more)

## Ambiguous Edges - Review These
- `run_youtube_workflow()` → `POST /v1/workflows/youtube-content-intelligence/runs (planned)`  [AMBIGUOUS]
  apps/api/README.md · relation: conceptually_related_to
- `analyze_transcript()` → `Provider-Agnostic AI Adapter Layer`  [AMBIGUOUS]
  docs/architecture/stack-decision.md · relation: conceptually_related_to
- `Provider-Agnostic AI Adapter Layer` → `openai SDK dependency`  [AMBIGUOUS]
  apps/api/requirements.txt · relation: conceptually_related_to

## Knowledge Gaps
- **9 isolated node(s):** `Proposed Repository Structure`, `Definition of Architectural Readiness`, `Container-Friendly Deployment`, `Deferred Stack Decisions`, `Staged User Rollout (Internal Team → Creators → SMBs → Ecosystem)` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 54 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Imaginarium Foundry README` connect `Foundry Vision & Architecture` to `YouTube Workflow & MVP Spec`, `PRD & SOP Generators`, `API, Agent Runtime & Stack`?**
  _High betweenness centrality (0.297) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `F.A.C.T.S. Network` (e.g. with `Business Engine` and `Digital Marketplaces`) actually correct?**
  _`F.A.C.T.S. Network` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Proposed Repository Structure`, `Definition of Architectural Readiness`, `Container-Friendly Deployment` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `YouTube Workflow & MVP Spec` be split into smaller, more focused modules?**
  _Cohesion score 0.08880666049953746 - nodes in this community are weakly interconnected._
- **Why does `Next.js + TypeScript Web App` connect `Next.js Command Center UI` to `YouTube Workflow & MVP Spec`, `API, Agent Runtime & Stack`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `run_youtube_workflow()` and `POST /v1/workflows/youtube-content-intelligence/runs (planned)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `analyze_transcript()` and `Provider-Agnostic AI Adapter Layer`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._