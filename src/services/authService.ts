import type { UserRole } from "@prisma/client";
import { prisma } from "../db/client";
import { hashPassword, verifyPassword } from "../auth/password";
import { signAuthToken } from "../auth/jwt";
import { ApiError } from "../errors";
import { recordAuditEvent } from "./auditService";

export interface AuthResult {
  token: string;
  user: { id: string; email: string; role: UserRole };
}

export async function registerUser(
  email: string,
  password: string,
  role: UserRole = "CONTRIBUTOR"
): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw ApiError.conflict("A user with this email already exists");
  }

  const user = await prisma.user.create({
    data: { email, passwordHash: await hashPassword(password), role },
  });

  await recordAuditEvent({
    action: "user.registered",
    entityType: "User",
    entityId: user.id,
    actorId: user.id,
    metadata: { email: user.email, role: user.role },
  });

  return toAuthResult(user);
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  await recordAuditEvent({
    action: "user.logged_in",
    entityType: "User",
    entityId: user.id,
    actorId: user.id,
  });

  return toAuthResult(user);
}

function toAuthResult(user: { id: string; email: string; role: UserRole }): AuthResult {
  return {
    token: signAuthToken({ sub: user.id, email: user.email, role: user.role }),
    user: { id: user.id, email: user.email, role: user.role },
  };
}
