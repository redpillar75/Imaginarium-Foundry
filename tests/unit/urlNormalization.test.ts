import { describe, expect, it } from "vitest";
import { extractShortcode, normalizeInstagramUrl } from "../../src/ingestion/urlNormalization";

describe("normalizeInstagramUrl", () => {
  it("strips query params and trailing slashes", () => {
    expect(normalizeInstagramUrl("https://www.instagram.com/p/ABC123/?igshid=xyz")).toBe(
      "https://instagram.com/p/ABC123"
    );
  });

  it("drops the www subdomain and lowercases the host", () => {
    expect(normalizeInstagramUrl("https://WWW.Instagram.com/reel/xyz789/")).toBe(
      "https://instagram.com/reel/xyz789"
    );
  });

  it("treats equivalent URLs as identical dedupe keys", () => {
    const a = normalizeInstagramUrl("https://instagram.com/p/ABC123");
    const b = normalizeInstagramUrl("https://www.instagram.com/p/ABC123/?utm_source=ig_web");
    expect(a).toBe(b);
  });

  it("rejects non-instagram URLs", () => {
    expect(() => normalizeInstagramUrl("https://example.com/p/ABC123")).toThrow(
      /instagram\.com/
    );
  });

  it("rejects malformed URLs", () => {
    expect(() => normalizeInstagramUrl("not-a-url")).toThrow();
  });

  it("rejects a bare domain with no post path", () => {
    expect(() => normalizeInstagramUrl("https://instagram.com/")).toThrow();
  });
});

describe("extractShortcode", () => {
  it("extracts the shortcode from a /p/ URL", () => {
    expect(extractShortcode("https://instagram.com/p/ABC123")).toBe("ABC123");
  });

  it("extracts the shortcode from a /reel/ URL", () => {
    expect(extractShortcode("https://instagram.com/reel/xyz789")).toBe("xyz789");
  });

  it("returns null when there is no recognizable shortcode", () => {
    expect(extractShortcode("https://instagram.com/someaccount")).toBeNull();
  });
});
