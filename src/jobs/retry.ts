export interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
  /** Called between attempts; override in tests to avoid real waits. */
  sleep?: (ms: number) => Promise<void>;
  onAttemptFailed?: (attempt: number, error: unknown) => void;
}

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Runs `fn`, retrying with exponential backoff (baseDelayMs * 2^attempt) on
 * failure up to `maxAttempts` total attempts. Rethrows the last error once
 * attempts are exhausted so the caller can persist failure state.
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  const sleep = options.sleep ?? defaultSleep;
  let lastError: unknown;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      options.onAttemptFailed?.(attempt, error);
      if (attempt < options.maxAttempts) {
        await sleep(options.baseDelayMs * 2 ** (attempt - 1));
      }
    }
  }

  throw lastError;
}
