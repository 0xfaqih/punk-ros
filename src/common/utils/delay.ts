import { log } from "@/common/utils/logger";

export async function doDelay(minSeconds: number = 10, maxSeconds: number = 30) {
  const delay = Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;

  log("info", `⏳ Waiting ${delay}s...`);
  await Bun.sleep(delay * 1000);
}
