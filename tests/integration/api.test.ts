import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../../src/agents/pipeline", () => ({
  runAnalysisPipeline: vi.fn().mockResolvedValue({
    thoth: { summary: "Test summary", keyTopics: ["a", "b"], researchNotes: {} },
    anansi: {
      contentPillar: "productivity",
      audienceAngle: "busy freelancers",
      hookOptions: ["hook 1", "hook 2", "hook 3"],
    },
    producer: {
      shortFormScript: "Open on ... [script]",
      suggestedPlatform: "Instagram Reels",
      productionNotes: {},
    },
    ledger: { monetizationTags: ["affiliate"], performanceNotes: {} },
  }),
}));

import { createApp } from "../../src/app";
import { prisma } from "../../src/db/client";
import { registerUser } from "../../src/services/authService";

const app = createApp();

async function loginAs(email: string, password: string) {
  const res = await request(app).post("/api/auth/login").send({ email, password });
  return res.body.token as string;
}

describe("Instagram Saves Engine API", () => {
  let contributorToken: string;
  let reviewerToken: string;

  beforeEach(async () => {
    await registerUser("contributor@example.com", "password123", "CONTRIBUTOR");
    await registerUser("reviewer@example.com", "password123", "REVIEWER");
    contributorToken = await loginAs("contributor@example.com", "password123");
    reviewerToken = await loginAs("reviewer@example.com", "password123");
  });

  it("rejects unauthenticated requests", async () => {
    const res = await request(app).post("/api/sources").send({ url: "https://instagram.com/p/ABC123" });
    expect(res.status).toBe(401);
  });

  it("runs the full submit -> analyze -> approve -> production task flow", async () => {
    const submitRes = await request(app)
      .post("/api/sources")
      .set("Authorization", `Bearer ${contributorToken}`)
      .send({ url: "https://www.instagram.com/p/CFullFlow01/" });

    expect(submitRes.status).toBe(201);
    expect(submitRes.body.wasDeduplicated).toBe(false);
    const sourceId = submitRes.body.sourceRecord.id;

    const source = await prisma.sourceRecord.findUniqueOrThrow({ where: { id: sourceId } });
    expect(source.status).toBe("ANALYZED");

    const idea = await prisma.contentIdea.findUniqueOrThrow({ where: { sourceRecordId: sourceId } });
    expect(idea.approvalStatus).toBe("PENDING_REVIEW");
    expect(idea.contentPillar).toBe("productivity");
    expect(idea.hookOptions).toHaveLength(3);

    // Only REVIEWER/ADMIN roles may record an approval decision.
    const forbidden = await request(app)
      .post(`/api/ideas/${idea.id}/approve`)
      .set("Authorization", `Bearer ${contributorToken}`)
      .send({});
    expect(forbidden.status).toBe(403);

    const approveRes = await request(app)
      .post(`/api/ideas/${idea.id}/approve`)
      .set("Authorization", `Bearer ${reviewerToken}`)
      .send({ comment: "looks great" });

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.approvalStatus).toBe("APPROVED");
    expect(approveRes.body.productionTask).toBeTruthy();

    const tasksRes = await request(app)
      .get("/api/production-tasks")
      .set("Authorization", `Bearer ${reviewerToken}`);
    expect(tasksRes.status).toBe(200);
    expect(tasksRes.body.tasks).toHaveLength(1);
    expect(tasksRes.body.tasks[0].contentIdea.id).toBe(idea.id);

    // Re-deciding an already-decided idea is rejected, not silently reapplied.
    const redecide = await request(app)
      .post(`/api/ideas/${idea.id}/reject`)
      .set("Authorization", `Bearer ${reviewerToken}`)
      .send({});
    expect(redecide.status).toBe(409);

    const auditActions = (await prisma.auditLog.findMany()).map((entry) => entry.action);
    expect(auditActions).toEqual(
      expect.arrayContaining(["source.ingested", "pipeline.succeeded", "idea.approved", "production_task.created"])
    );
  });

  it("deduplicates a second submission of the same normalized URL", async () => {
    const url = "https://instagram.com/p/CDedupe0001/";
    const first = await request(app)
      .post("/api/sources")
      .set("Authorization", `Bearer ${contributorToken}`)
      .send({ url });
    expect(first.status).toBe(201);

    const second = await request(app)
      .post("/api/sources")
      .set("Authorization", `Bearer ${contributorToken}`)
      .send({ url: "https://www.instagram.com/p/CDedupe0001?igshid=abc" });

    expect(second.status).toBe(200);
    expect(second.body.wasDeduplicated).toBe(true);
    expect(second.body.sourceRecord.id).toBe(first.body.sourceRecord.id);

    const count = await prisma.sourceRecord.count();
    expect(count).toBe(1);
  });
});
