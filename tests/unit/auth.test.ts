import { describe, expect, it, vi } from "vitest";
import { hashPassword, verifyPassword } from "../../src/auth/password";
import { signAuthToken, verifyAuthToken } from "../../src/auth/jwt";
import { requireAuth, requireRole } from "../../src/auth/middleware";
import { ApiError } from "../../src/errors";
import type { Request, Response } from "express";

describe("password hashing", () => {
  it("verifies a correct password against its hash", async () => {
    const hash = await hashPassword("correct horse battery staple");
    await expect(verifyPassword("correct horse battery staple", hash)).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("correct horse battery staple");
    await expect(verifyPassword("wrong password", hash)).resolves.toBe(false);
  });
});

describe("JWT auth tokens", () => {
  it("round-trips the payload through sign/verify", () => {
    const token = signAuthToken({ sub: "user-1", email: "a@example.com", role: "ADMIN" });
    const payload = verifyAuthToken(token);
    expect(payload).toMatchObject({ sub: "user-1", email: "a@example.com", role: "ADMIN" });
  });

  it("rejects a tampered token", () => {
    const token = signAuthToken({ sub: "user-1", email: "a@example.com", role: "ADMIN" });
    expect(() => verifyAuthToken(token.slice(0, -2) + "xx")).toThrow();
  });
});

function mockReqRes(headers: Record<string, string> = {}) {
  const req = { headers, user: undefined } as unknown as Request;
  const res = {} as Response;
  const next = vi.fn();
  return { req, res, next };
}

describe("requireAuth middleware", () => {
  it("rejects requests with no Authorization header", () => {
    const { req, res, next } = mockReqRes();
    requireAuth(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect((next.mock.calls[0][0] as ApiError).statusCode).toBe(401);
  });

  it("rejects an invalid token", () => {
    const { req, res, next } = mockReqRes({ authorization: "Bearer not-a-real-token" });
    requireAuth(req, res, next);
    expect((next.mock.calls[0][0] as ApiError).statusCode).toBe(401);
  });

  it("attaches the decoded user for a valid token", () => {
    const token = signAuthToken({ sub: "user-1", email: "a@example.com", role: "CONTRIBUTOR" });
    const { req, res, next } = mockReqRes({ authorization: `Bearer ${token}` });
    requireAuth(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.user).toMatchObject({ sub: "user-1", role: "CONTRIBUTOR" });
  });
});

describe("requireRole middleware", () => {
  it("forbids a user whose role is not in the allow-list", () => {
    const { req, res, next } = mockReqRes();
    req.user = { sub: "user-1", email: "a@example.com", role: "CONTRIBUTOR" };
    requireRole("ADMIN", "REVIEWER")(req, res, next);
    expect((next.mock.calls[0][0] as ApiError).statusCode).toBe(403);
  });

  it("allows a user whose role is in the allow-list", () => {
    const { req, res, next } = mockReqRes();
    req.user = { sub: "user-1", email: "a@example.com", role: "ADMIN" };
    requireRole("ADMIN", "REVIEWER")(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
});
