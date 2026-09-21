import { defineConfig } from "vitest/config";
import dotenv from "dotenv";
import path from "node:path";

// Loaded here (in the config file itself, evaluated directly by Node
// before any test module graph exists) rather than in a setup file, so it
// is guaranteed to land in process.env before src/config/env.ts reads it
// — ESM import hoisting inside a setup file would otherwise race that.
const testEnv = dotenv.config({ path: path.resolve(__dirname, ".env.test") }).parsed ?? {};

export default defineConfig({
  test: {
    environment: "node",
    env: testEnv,
    clearMocks: true,
    setupFiles: ["./tests/setup.ts"],
    hookTimeout: 20000,
    testTimeout: 20000,
    fileParallelism: false,
  },
});
