# Instagram Saves Engine

Content-intelligence pipeline that turns a saved Instagram post into a
structured, human-reviewed content idea and (once approved) a production
task. This is the first module in the Imaginarium Command Center; its
layout (`src/ingestion`, `src/agents`, `src/services`, `src/routes`) is the
pattern future Command Center modules should follow.

## Architecture

```
POST /api/sources { url }
        │
        ▼
 normalize + dedupe (src/ingestion/urlNormalization.ts)
        │  (dedupe hit → return existing SourceRecord, no re-processing)
        ▼
 IngestionAdapter.fetchContent()         src/ingestion/*
        │  fetches public post metadata (caption, author, media type)
        │  no Instagram login/session is ever used or stored
        ▼
 SourceRecord stored in Postgres          prisma/schema.prisma
        │
        ▼
 ProcessingJob (idempotent, retryable)     src/services/pipelineJobService.ts
        │
        ▼
 Agent pipeline (src/agents/pipeline.ts), run in order:
   THOTH    – research / source analysis
   ANANSI   – content pillar, audience angle, 3 hooks
   PRODUCER – short-form script + suggested platform
   LEDGER   – monetization tags + performance notes
        │
        ▼
 ContentIdea stored, approvalStatus = PENDING_REVIEW
        │
        ▼
 Human review: POST /api/ideas/:id/approve | /reject   (REVIEWER/ADMIN only)
        │  (approve only)
        ▼
 ProductionTask created
```

Every mutating step above writes an `AuditLog` row (`src/services/auditService.ts`).

### Why it's built this way

- **Modular ingestion** (`src/ingestion/types.ts`): all callers depend on the
  `IngestionAdapter` interface, not a concrete implementation. The default
  `html-meta` adapter fetches a saved post's public Open Graph metadata over
  plain HTTP — it never logs into Instagram, so there is no session/login
  credential to store in the first place. Swap adapters via the
  `INGESTION_ADAPTER` env var; a `fixture` adapter is included for
  local dev/tests, and a future adapter (official Graph API, bulk CSV
  import, another platform entirely) is a new file plus one line in
  `src/ingestion/index.ts`.
- **Idempotent processing**: `SourceRecord.normalizedUrl` is a unique
  constraint, so resubmitting the same post URL (with different tracking
  params) returns the existing record instead of creating a duplicate or
  re-spending LLM calls. Each source also has at most one `ProcessingJob`,
  keyed by a deterministic `idempotencyKey` (`ANALYSIS_PIPELINE:<sourceId>`),
  so retrying never double-runs the pipeline.
- **Retries**: pipeline execution is wrapped in `src/jobs/retry.ts`
  (exponential backoff, `JOB_MAX_ATTEMPTS` attempts). A job that exhausts
  its retries is marked `FAILED` with `lastError` recorded, and can be
  re-run via `POST /api/sources/:id/retry`.
- **Human approval gate**: `ProductionTask` rows are created in exactly one
  place — `src/services/approvalService.ts`, as the direct result of a
  `REVIEWER`/`ADMIN` decision. The agent pipeline never creates one itself.
- **Auth & audit**: JWT bearer auth (`src/auth/`) with three roles
  (`ADMIN`, `REVIEWER`, `CONTRIBUTOR`); public self-registration always
  creates a `CONTRIBUTOR` account, so an unauthenticated caller can never
  grant themselves review/admin power. Every ingestion, approval, and
  production-task-creation event is written to the append-only `AuditLog`
  table.

## Data model

See `prisma/schema.prisma`. Key tables: `users`, `source_records`,
`processing_jobs`, `content_ideas`, `approval_decisions`,
`production_tasks`, `audit_logs`.

## API

All routes except `/health` and `/api/auth/*` require
`Authorization: Bearer <token>`.

| Method & path                     | Role              | Purpose |
|-----------------------------------|-------------------|---------|
| `POST /api/auth/register`         | public            | Self-signup as CONTRIBUTOR |
| `POST /api/auth/login`            | public            | Get a JWT |
| `POST /api/auth/users`            | ADMIN             | Create a user with any role |
| `POST /api/sources`               | any authenticated | Submit a saved post URL |
| `GET /api/sources/:id`            | any authenticated | Check ingestion/pipeline status |
| `POST /api/sources/:id/retry`     | REVIEWER, ADMIN   | Re-run a failed pipeline job |
| `GET /api/ideas`                  | any authenticated | List content ideas (`?status=`) |
| `GET /api/ideas/:id`              | any authenticated | Full idea detail (MVP output) |
| `POST /api/ideas/:id/approve`     | REVIEWER, ADMIN   | Approve → creates ProductionTask |
| `POST /api/ideas/:id/reject`      | REVIEWER, ADMIN   | Reject |
| `GET /api/production-tasks`       | any authenticated | List production tasks |
| `GET /api/production-tasks/:id`   | any authenticated | Production task detail |

### Example: submit a saved post

```bash
curl -X POST http://localhost:3000/api/sources \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.instagram.com/p/CExampleShortcode/"}'
```

`GET /api/ideas/:id` on the resulting idea returns the MVP output: summary,
content pillar, three hook options, short-form script, suggested platform,
approval status, and (once approved) the linked production task.

## Local setup

Prerequisites: Node 20+, a local PostgreSQL 16 server.

```bash
npm install
cp .env.example .env          # fill in JWT_SECRET and ANTHROPIC_API_KEY

# create the dev database (adjust to your local Postgres setup)
createuser foundry --pwprompt --createdb
createdb -O foundry imaginarium_foundry

npm run prisma:migrate        # applies prisma/migrations, generates the client
npm run dev                   # starts the API on $PORT (default 3000)
```

### Running tests

Tests run against a **separate** local database defined in `.env.test`
(`imaginarium_foundry_test`) and mock the Anthropic agent calls, so `npm test`
requires Postgres but never calls a real LLM or the real Instagram network.

```bash
createdb -O foundry imaginarium_foundry_test
DATABASE_URL="postgresql://foundry:foundry@localhost:5432/imaginarium_foundry_test?schema=public" npx prisma migrate deploy

npm test
```

### Environment variables

See `.env.example` for the full list and defaults. Notable ones:

- `DATABASE_URL` — Postgres connection string. Never commit real credentials.
- `JWT_SECRET` — sign/verify key for auth tokens. Generate with `openssl rand -hex 32`.
- `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL` — used by the THOTH/ANANSI/PRODUCER/LEDGER agents.
- `INGESTION_ADAPTER` — `html-meta` (default, public metadata only) or `fixture` (deterministic, offline).
- `JOB_MAX_ATTEMPTS`, `JOB_RETRY_BASE_DELAY_MS` — retry/backoff tuning for the analysis pipeline.

**No Instagram session, cookie, or login credential is ever read, required,
or stored by this module** — the default ingestion adapter only fetches a
post's publicly served HTML/Open Graph metadata.
