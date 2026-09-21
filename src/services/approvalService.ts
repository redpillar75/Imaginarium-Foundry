import type { ApprovalStatus, ProductionTask } from "@prisma/client";
import { prisma } from "../db/client";
import { ApiError } from "../errors";
import { recordAuditEvent } from "./auditService";

export interface DecideApprovalInput {
  contentIdeaId: string;
  decision: Extract<ApprovalStatus, "APPROVED" | "REJECTED">;
  decidedById: string;
  comment?: string;
}

export interface DecideApprovalResult {
  contentIdeaId: string;
  approvalStatus: ApprovalStatus;
  productionTask: ProductionTask | null;
}

/**
 * The single human-in-the-loop gate in the pipeline: a production task is
 * only ever created here, as the direct result of a REVIEWER/ADMIN decision
 * — never automatically by the agent pipeline. Re-deciding an idea that's
 * already been decided is rejected rather than silently overwritten, so the
 * audit trail always reflects the first, authoritative decision.
 */
export async function decideApproval(input: DecideApprovalInput): Promise<DecideApprovalResult> {
  const idea = await prisma.contentIdea.findUnique({ where: { id: input.contentIdeaId } });
  if (!idea) {
    throw ApiError.notFound(`Content idea ${input.contentIdeaId} not found`);
  }
  if (idea.approvalStatus !== "PENDING_REVIEW") {
    throw ApiError.conflict(
      `Content idea ${input.contentIdeaId} was already ${idea.approvalStatus.toLowerCase()}`
    );
  }

  await prisma.approvalDecision.create({
    data: {
      contentIdeaId: idea.id,
      status: input.decision,
      comment: input.comment,
      decidedById: input.decidedById,
    },
  });

  await prisma.contentIdea.update({
    where: { id: idea.id },
    data: { approvalStatus: input.decision },
  });

  await recordAuditEvent({
    action: input.decision === "APPROVED" ? "idea.approved" : "idea.rejected",
    entityType: "ContentIdea",
    entityId: idea.id,
    actorId: input.decidedById,
    metadata: { comment: input.comment },
  });

  let productionTask: ProductionTask | null = null;
  if (input.decision === "APPROVED") {
    productionTask = await prisma.productionTask.create({
      data: {
        contentIdeaId: idea.id,
        title: `Produce: ${idea.contentPillar}`,
      },
    });

    await recordAuditEvent({
      action: "production_task.created",
      entityType: "ProductionTask",
      entityId: productionTask.id,
      actorId: input.decidedById,
      metadata: { contentIdeaId: idea.id },
    });
  }

  return { contentIdeaId: idea.id, approvalStatus: input.decision, productionTask };
}
