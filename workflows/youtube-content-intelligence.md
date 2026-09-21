# YouTube Content Intelligence Workflow

## Purpose

Convert a YouTube URL into structured, reusable content intelligence for creators, educators, and small businesses.

## MVP Input

- YouTube video URL
- Optional audience or business goal
- Optional tone and platform targets

## MVP Processing Pipeline

1. **Ingest** — validate the URL and capture video metadata.
2. **Transcribe** — obtain a transcript through an approved transcription provider or user-supplied transcript.
3. **Segment** — divide the transcript into meaningful topics and time ranges.
4. **Interpret** — identify key claims, themes, lessons, entities, and notable moments.
5. **Transform** — produce content assets from the source material.
6. **Review** — present results for human approval before publication.
7. **Export** — package approved outputs for downstream publishing tools.

## MVP Outputs

- Video metadata summary
- Structured transcript
- Chapter and topic outline
- Key insights and quotable moments
- Short-form clip candidates with timestamps
- Short-form scripts
- Captions and hooks
- Suggested titles and descriptions
- Content repurposing checklist

## Initial Agent Roles

### Ingestion Agent

Validates the input URL and collects available metadata.

### Transcript Agent

Retrieves or processes a transcript and reports confidence or missing sections.

### Intelligence Agent

Extracts themes, claims, concepts, entities, and teaching points.

### Repurposing Agent

Creates clip candidates, hooks, captions, titles, and platform-specific variations.

### Quality Agent

Checks factual traceability to the source, duplicate outputs, unsupported claims, and missing timestamps.

### Orchestrator

Coordinates the workflow, records state, handles failures, and returns a consistent result package.

## Human Review Gates

The system must pause for user review before:

- Publishing or distributing content
- Making claims that cannot be traced to the source
- Editing quotations beyond clearly marked transformation
- Using copyrighted media outside the user's authorized rights

## Suggested Result Contract

```json
{
  "workflow": "youtube-content-intelligence",
  "status": "completed",
  "source": {
    "url": "https://www.youtube.com/watch?v=example",
    "title": "Example title"
  },
  "artifacts": {
    "summary": "...",
    "chapters": [],
    "clip_candidates": [],
    "hooks": [],
    "captions": [],
    "titles": []
  },
  "quality": {
    "warnings": [],
    "requires_review": true
  }
}
```

## Acceptance Criteria

- Rejects malformed or missing URLs with a clear error.
- Preserves the source URL and metadata throughout the run.
- Every clip candidate includes a rationale and timestamp when available.
- Generated claims can be traced back to transcript passages or are marked as suggestions.
- A failed agent does not silently produce a false success state.
- Results can be reviewed before any external publishing action.

## Out of Scope for the First Prototype

- Automatic public posting
- Fully autonomous ad spending
- Unverified speaker or identity detection
- Guaranteed transcript availability for every video
- Complex multi-user billing and permissions
