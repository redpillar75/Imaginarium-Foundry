import { Prisma } from "@prisma/client";
import { prisma } from "../db/client";

export interface RecordAuditEventInput {
  action: string;
  entityType: string;
  entityId: string;
  actorId?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Every mutating action in the pipeline (ingestion, approval decisions,
 * production task creation, etc.) writes one of these. Kept append-only
 * and separate from domain tables so it can't be edited by the same code
 * paths that produce it.
 */
export async function recordAuditEvent(input: RecordAuditEventInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      actorId: input.actorId ?? null,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
  });
}
