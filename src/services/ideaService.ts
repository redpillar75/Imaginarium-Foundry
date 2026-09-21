import { prisma } from "../db/client";
import { ApiError } from "../errors";

export async function getIdeaById(id: string) {
  const idea = await prisma.contentIdea.findUnique({
    where: { id },
    include: { sourceRecord: true, productionTask: true, approvalDecisions: true },
  });
  if (!idea) {
    throw ApiError.notFound(`Content idea ${id} not found`);
  }
  return idea;
}

export async function listIdeas(status?: "PENDING_REVIEW" | "APPROVED" | "REJECTED") {
  return prisma.contentIdea.findMany({
    where: status ? { approvalStatus: status } : undefined,
    orderBy: { createdAt: "desc" },
    include: { sourceRecord: true },
  });
}
