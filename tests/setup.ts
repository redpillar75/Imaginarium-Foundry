import { beforeEach, afterAll } from "vitest";
import { prisma } from "../src/db/client";

async function truncateAll(): Promise<void> {
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.approvalDecision.deleteMany(),
    prisma.productionTask.deleteMany(),
    prisma.contentIdea.deleteMany(),
    prisma.processingJob.deleteMany(),
    prisma.sourceRecord.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

beforeEach(async () => {
  await truncateAll();
});

afterAll(async () => {
  await prisma.$disconnect();
});
