# Initial Technology Stack Decision

## Decision

The first prototype will use a modular web application architecture:

- **Web app:** Next.js with TypeScript
- **API:** Python with FastAPI
- **Database:** PostgreSQL
- **Background jobs:** Redis-compatible queue, introduced when asynchronous processing is needed
- **AI integration:** Provider-agnostic adapter layer
- **Transcription:** Pluggable transcription provider with support for user-supplied transcripts
- **Deployment:** Container-friendly deployment with environment-based configuration

## Why This Stack

- TypeScript supports a responsive command-center interface.
- FastAPI supports clear API contracts and Python's AI/media ecosystem.
- PostgreSQL provides durable storage for users, projects, workflow runs, artifacts, and audit records.
- Provider adapters reduce vendor lock-in.
- Container-friendly services support local development and future deployment options.

## Initial Engineering Principles

1. Keep provider-specific code behind adapters.
2. Treat every workflow run as a traceable state machine.
3. Require human approval before external publishing.
4. Store source references for generated claims and clip candidates.
5. Make failures explicit; never report a failed workflow as completed.
6. Keep secrets in environment variables or a managed secret store.

## Deferred Decisions

- Authentication provider
- Hosting vendor
- Queue implementation
- Vector database or retrieval layer
- Billing and subscription system
- Social platform publishing integrations
