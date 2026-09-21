import { prisma } from "../db/client";
import { ApiError } from "../errors";

export async function listProductionTasks() {
  return prisma.productionTask.findMany({
    orderBy: { createdAt: "desc" },
    include: { contentIdea: true },
  });
}

export async function getProductionTaskById(id: string) {
  const task = await prisma.productionTask.findUnique({
    where: { id },
    include: { contentIdea: true },
  });
  if (!task) {
    throw ApiError.notFound(`Production task ${id} not found`);
  }
  return task;
}
