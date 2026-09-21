# API Service

The API service will expose workflow endpoints for the Imaginarium Command Center.

## Initial Responsibilities

- Validate workflow requests
- Create and track workflow runs
- Coordinate agent execution
- Persist artifacts and audit events
- Return reviewable results to the web app

## Planned First Endpoint

`POST /v1/workflows/youtube-content-intelligence/runs`

The first implementation should accept a YouTube URL and optional audience, goals, tone, and target platforms.
