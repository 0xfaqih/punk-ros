import { log } from "@/common/utils/logger";
import { config } from "@/config/config";

export async function withRetry<T>(
  fn: () => Promise<T>,
  label: string = "Task",
  maxRetries: number = config.maxRetries,
  cooldownMs: number = config.retryCooldownMs
): Promise<T> {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      
      const message =
        err?.message ||
        err?.error?.message ||
        err?.data?.message ||
        String(err);

      const code =
        err?.code ||
        err?.error?.code ||
        err?.data?.code ||
        "UNKNOWN";

      const isRetriable =
        message.toLowerCase().includes("timeout") ||
        message.toLowerCase().includes("busy") ||
        message.toLowerCase().includes("rate limit") ||
        message.toLowerCase().includes("temporarily unavailable") ||
        message.toLowerCase().includes("the service was busy.") ||
        code === -32603 ||
        code === "SERVER_ERROR" ||
        code === "TIMEOUT" ||
        code === "ECONNRESET" ||
        code === "UNKNOWN_ERROR" || 
        code === "TRANSACTION_REPLACED";

      if (!isRetriable) {
        log("error", `${label} failed with non-retriable error: ${message}`);
        throw err;
      }

      log(
        "warn",
        `${label} failed (Attempt ${attempt}/${maxRetries}): ${message}`
      );

      if (attempt < maxRetries) {
        await Bun.sleep(cooldownMs * Math.pow(2, attempt)); // progressive backoff
      } else {
        log(
          "error",
          `${label} failed after ${maxRetries} attempts. Final error: ${JSON.stringify(err, null, 2)}`
        );
        await Bun.sleep(cooldownMs * 2);
        throw new Error(`[${label}] failed after max retries: ${message}`);
      }
    }
  }

  throw new Error(`${label} failed after retries`);
}

