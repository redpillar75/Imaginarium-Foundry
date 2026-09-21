import type { ProcessingJob } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "../db/client";
import { env } from "../config/env";
import { withRetry } from "../jobs/retry";
import { runAnalysisPipeline } from "../agents/pipeline";
import type { IngestedContent } from "../ingestion/types";
import { recordAuditEvent } from "./auditService";
import { logger } from "../config/logger";

function idempotencyKeyFor(sourceRecordId: string): string {
  return `ANALYSIS_PIPELINE:${sourceRecordId}`;
}

/**
 * Idempotently ensures exactly one analysis job exists per source record,
 * then processes it. Calling this twice for the same source (e.g. a
 * duplicate submission racing the dedupe check, or a manual retry request)
 * reuses the same job row instead of double-running the pipeline.
 */
export async function enqueueAnalysisJob(sourceRecordId: string): Promise<ProcessingJob> {
  const job = await prisma.processingJob.upsert({
    where: { idempotencyKey: idempotencyKeyFor(sourceRecordId) },
    update: {},
    create: {
      idempotencyKey: idempotencyKeyFor(sourceRecordId),
      jobType: "ANALYSIS_PIPELINE",
      sourceRecordId,
      maxAttempts: env.JOB_MAX_ATTEMPTS,
    },
  });

  if (job.status === "PENDING") {
    return processAnalysisJob(job.id);
  }
  return job;
}

export async function processAnalysisJob(jobId: string): Promise<ProcessingJob> {
  const job = await prisma.processingJob.findUniqueOrThrow({
    where: { id: jobId },
    include: { sourceRecord: true },
  });

  if (job.status === "SUCCEEDED") {
    return job; // already processed; nothing to do
  }

  await prisma.processingJob.update({
    where: { id: job.id },
    data: { status: "IN_PROGRESS", startedAt: new Date() },
  });
  await prisma.sourceRecord.update({
    where: { id: job.sourceRecordId },
    data: { status: "PROCESSING" },
  });

  let attemptCount = job.attempts;

  try {
    const result = await withRetry(
      async () => {
        attemptCount += 1;
        await prisma.processingJob.update({
          where: { id: job.id },
          data: { attempts: attemptCount },
        });
        const content: IngestedContent = {
          sourceUrl: job.sourceRecord.sourceUrl,
          normalizedUrl: job.sourceRecord.normalizedUrl,
          shortcode: job.sourceRecord.shortcode,
          caption: job.sourceRecord.caption,
          authorHandle: job.sourceRecord.authorHandle,
          mediaType: job.sourceRecord.mediaType,
          metadata: (job.sourceRecord.metadata as Record<string, unknown>) ?? {},
        };
        return runAnalysisPipeline(content);
      },
      {
        maxAttempts: job.maxAttempts,
        baseDelayMs: env.JOB_RETRY_BASE_DELAY_MS,
        onAttemptFailed: (attempt, error) => {
          logger.warn(
            { jobId: job.id, attempt, error: (error as Error).message },
            "analysis pipeline attempt failed"
          );
        },
      }
    );

    await prisma.contentIdea.create({
      data: {
        sourceRecordId: job.sourceRecordId,
        summary: result.thoth.summary,
        researchNotes: { keyTopics: result.thoth.keyTopics, ...result.thoth.researchNotes },
        contentPillar: result.anansi.contentPillar,
        audienceAngle: result.anansi.audienceAngle,
        hookOptions: result.anansi.hookOptions,
        shortFormScript: result.producer.shortFormScript,
        suggestedPlatform: result.producer.suggestedPlatform,
        productionNotes: result.producer.productionNotes as Prisma.InputJsonValue,
        monetizationTags: result.ledger.monetizationTags,
        performanceNotes: result.ledger.performanceNotes as Prisma.InputJsonValue,
      },
    });

    await prisma.sourceRecord.update({
      where: { id: job.sourceRecordId },
      data: { status: "ANALYZED" },
    });

    const completedJob = await prisma.processingJob.update({
      where: { id: job.id },
      data: { status: "SUCCEEDED", completedAt: new Date() },
    });

    await recordAuditEvent({
      action: "pipeline.succeeded",
      entityType: "ProcessingJob",
      entityId: job.id,
      metadata: { sourceRecordId: job.sourceRecordId, attempts: attemptCount },
    });

    return completedJob;
  } catch (error) {
    const message = (error as Error).message;

    await prisma.sourceRecord.update({
      where: { id: job.sourceRecordId },
      data: { status: "FAILED" },
    });

    const failedJob = await prisma.processingJob.update({
      where: { id: job.id },
      data: { status: "FAILED", lastError: message, completedAt: new Date() },
    });

    await recordAuditEvent({
      action: "pipeline.failed",
      entityType: "ProcessingJob",
      entityId: job.id,
      metadata: { sourceRecordId: job.sourceRecordId, attempts: attemptCount, error: message },
    });

    return failedJob;
  }
}

/**
 * Re-runs a previously failed job. Resets attempts so it gets the full
 * retry budget again; the idempotency key stays the same so this never
 * creates a second job for the same source record.
 */
export async function retryAnalysisJob(sourceRecordId: string): Promise<ProcessingJob> {
  const job = await prisma.processingJob.update({
    where: { idempotencyKey: idempotencyKeyFor(sourceRecordId) },
    data: { status: "PENDING", attempts: 0, lastError: null },
  });
  return processAnalysisJob(job.id);
}
