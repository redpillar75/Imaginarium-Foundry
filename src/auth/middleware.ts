import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@prisma/client";
import { verifyAuthToken, type AuthTokenPayload } from "./jwt";
import { ApiError } from "../errors";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    next(ApiError.unauthorized());
    return;
  }

  const token = header.slice("Bearer ".length);
  try {
    req.user = verifyAuthToken(token);
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(ApiError.unauthorized());
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      next(ApiError.forbidden(`Requires one of roles: ${allowedRoles.join(", ")}`));
      return;
    }
    next();
  };
}
