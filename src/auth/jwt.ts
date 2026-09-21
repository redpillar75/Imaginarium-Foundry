import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { UserRole } from "@prisma/client";

export interface AuthTokenPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  const options: jwt.SignOptions = { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}
