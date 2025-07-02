import { isAxiosError } from "axios";

export function normalizeAxiosError(error: unknown): Error {
  if (isAxiosError(error)) {
    const status = error.response?.status ?? "unknown";
    const data = error.response?.data;

    const message =
      typeof data === "string"
        ? data
        : data?.message || JSON.stringify(data) || error.message;

    return new Error(`API Error (${status}): ${message}`);
  }

  return error instanceof Error ? error : new Error(String(error));
}
