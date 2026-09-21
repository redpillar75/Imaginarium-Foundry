import type { SourceRecord } from "@prisma/client";
import { prisma } from "../db/client";
import { getIngestionAdapter, normalizeInstagramUrl } from "../ingestion";
import { recordAuditEvent } from "./auditService";
import { enqueueAnalysisJob } from "./pipelineJobService";

export interface SubmitSourceResult {
  sourceRecord: SourceRecord;
  wasDeduplicated: boolean;
}

/**
 * Submits a saved-post URL for ingestion. Deduplication happens on the
 * normalized URL *before* any network fetch or LLM spend: if the same post
 * was already submitted, the existing record is returned untouched instead
 * of re-ingesting or re-running the pipeline.
 */
export async function submitSource(
  rawUrl: string,
  submittedById: string
): Promise<SubmitSourceResult> {
  const normalizedUrl = normalizeInstagramUrl(rawUrl);

  const existing = await prisma.sourceRecord.findUnique({ where: { normalizedUrl } });
  if (existing) {
    await recordAuditEvent({
      action: "source.deduplicated",
      entityType: "SourceRecord",
      entityId: existing.id,
      actorId: submittedById,
      metadata: { rawUrl },
    });
    return { sourceRecord: existing, wasDeduplicated: true };
  }

  const adapter = getIngestionAdapter();
  const content = await adapter.fetchContent(rawUrl);

  const sourceRecord = await prisma.sourceRecord.create({
    data: {
      sourceUrl: content.sourceUrl,
      normalizedUrl: content.normalizedUrl,
      shortcode: content.shortcode,
      ingestionSource: adapter.name,
      caption: content.caption,
      authorHandle: content.authorHandle,
      mediaType: content.mediaType,
      metadata: content.metadata as object,
      submittedById,
    },
  });

  await recordAuditEvent({
    action: "source.ingested",
    entityType: "SourceRecord",
    entityId: sourceRecord.id,
    actorId: submittedById,
    metadata: { normalizedUrl: sourceRecord.normalizedUrl, adapter: adapter.name },
  });

  await enqueueAnalysisJob(sourceRecord.id);

  return { sourceRecord, wasDeduplicated: false };
}

export async function getSourceById(id: string): Promise<SourceRecord | null> {
  return prisma.sourceRecord.findUnique({ where: { id } });
}
