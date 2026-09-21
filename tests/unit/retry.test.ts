import { describe, expect, it, vi } from "vitest";
import { withRetry } from "../../src/jobs/retry";

describe("withRetry", () => {
  it("returns the result on the first success without retrying", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const result = await withRetry(fn, { maxAttempts: 3, baseDelayMs: 1, sleep: async () => {} });
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries after a failure and eventually succeeds", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce("ok");

    const result = await withRetry(fn, { maxAttempts: 3, baseDelayMs: 1, sleep: async () => {} });
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("throws the last error once attempts are exhausted", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("always fails"));

    await expect(
      withRetry(fn, { maxAttempts: 3, baseDelayMs: 1, sleep: async () => {} })
    ).rejects.toThrow("always fails");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("calls onAttemptFailed for each failed attempt", async () => {
    const onAttemptFailed = vi.fn();
    const fn = vi.fn().mockRejectedValue(new Error("nope"));

    await expect(
      withRetry(fn, { maxAttempts: 2, baseDelayMs: 1, sleep: async () => {}, onAttemptFailed })
    ).rejects.toThrow();
    expect(onAttemptFailed).toHaveBeenCalledTimes(2);
  });
});
