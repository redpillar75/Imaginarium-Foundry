import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient instance across the process (and across
// tsx watch reloads in development) instead of opening a new connection
// pool per import.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
