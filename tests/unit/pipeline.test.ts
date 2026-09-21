import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/agents/thoth", () => ({
  runThoth: vi.fn().mockResolvedValue({
    summary: "A summary",
    keyTopics: ["topic-a"],
    researchNotes: { tone: "casual" },
  }),
}));

vi.mock("../../src/agents/anansi", () => ({
  runAnansi: vi.fn().mockResolvedValue({
    contentPillar: "productivity",
    audienceAngle: "busy freelancers",
    hookOptions: ["hook 1", "hook 2", "hook 3"],
  }),
}));

vi.mock("../../src/agents/producer", () => ({
  runProducer: vi.fn().mockResolvedValue({
    shortFormScript: "script text",
    suggestedPlatform: "Instagram Reels",
    productionNotes: { pacing: "fast" },
  }),
}));

vi.mock("../../src/agents/ledger", () => ({
  runLedger: vi.fn().mockResolvedValue({
    monetizationTags: ["affiliate"],
    performanceNotes: { targetViews: 10000 },
  }),
}));

import { runAnalysisPipeline } from "../../src/agents/pipeline";
import { runThoth } from "../../src/agents/thoth";
import { runAnansi } from "../../src/agents/anansi";
import { runProducer } from "../../src/agents/producer";
import { runLedger } from "../../src/agents/ledger";
import type { IngestedContent } from "../../src/ingestion/types";

const mockedRunThoth = vi.mocked(runThoth);
const mockedRunAnansi = vi.mocked(runAnansi);

const content: IngestedContent = {
  sourceUrl: "https://instagram.com/p/ABC123",
  normalizedUrl: "https://instagram.com/p/ABC123",
  shortcode: "ABC123",
  caption: "a caption",
  authorHandle: "someone",
  mediaType: "video",
  metadata: {},
};

describe("runAnalysisPipeline", () => {
  it("runs each agent in order, threading outputs forward", async () => {
    const result = await runAnalysisPipeline(content);

    expect(runThoth).toHaveBeenCalledWith(content);
    expect(runAnansi).toHaveBeenCalledWith(content, await mockedRunThoth.mock.results[0].value);
    expect(runProducer).toHaveBeenCalled();
    expect(runLedger).toHaveBeenCalled();

    expect(result.thoth.summary).toBe("A summary");
    expect(result.anansi.hookOptions).toHaveLength(3);
    expect(result.producer.suggestedPlatform).toBe("Instagram Reels");
    expect(result.ledger.monetizationTags).toContain("affiliate");
  });

  it("propagates an error from any stage without calling later stages", async () => {
    mockedRunAnansi.mockRejectedValueOnce(new Error("ANANSI exploded"));

    await expect(runAnalysisPipeline(content)).rejects.toThrow("ANANSI exploded");
    expect(runProducer).not.toHaveBeenCalled();
  });
});
