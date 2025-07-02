import {log} from "@/common/utils/logger";
import {config} from "@/config/config";

export async function withRetry<T>(
  fn: () => Promise<T>,
  label: string = 'Task',
  maxRetries: number = config.maxRetries,
  cooldownMs: number = config.retryCooldownMs
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (e: any) {
      attempt++;
      log('warn', `${label} failed (Attempt ${attempt}/${maxRetries}): ${e.message || e}`);
      if (attempt < maxRetries) {
        await new Promise(res => setTimeout(res, cooldownMs));
      } else {
        log('error', `${label} failed after ${maxRetries} attempts, entering cooldown.`);
        await new Promise(res => setTimeout(res, cooldownMs * 2));
        throw e;
      }
    }
  }

  throw new Error(`${label} failed after retries`);
}
