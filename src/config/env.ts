import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_SECRET: z.string().min(16, "JWT_SECRET must be a long random value"),
  JWT_EXPIRES_IN: z.string().default("12h"),

  ANTHROPIC_API_KEY: z.string().optional().default(""),
  ANTHROPIC_MODEL: z.string().default("claude-sonnet-5"),

  INGESTION_ADAPTER: z.string().default("html-meta"),
  INGESTION_FETCH_TIMEOUT_MS: z.coerce.number().default(10000),
  INGESTION_MAX_RETRIES: z.coerce.number().default(3),

  JOB_MAX_ATTEMPTS: z.coerce.number().default(3),
  JOB_RETRY_BASE_DELAY_MS: z.coerce.number().default(500),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration");
  }
  return parsed.data;
}

export const env = loadEnv();
