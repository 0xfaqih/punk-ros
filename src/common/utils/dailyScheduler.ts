import { setTimeout } from 'timers/promises';
import { log } from './logger';

type MainFunction = () => Promise<void>;

export async function runTodayThenRandomDaily(mainFn: MainFunction, options?: { randomDelayToday?: boolean }) {
  if (options?.randomDelayToday) {
    const delay = Math.floor(Math.random() * 4 * 60 * 60 * 1000);
    log('info', `Daily delay: ${Math.floor(delay / 60000)} minutes`);
    await setTimeout(delay);
  }
  try {
    await mainFn();
  } catch (e) {
    log('error', `Error (once): ${e}`);
  }

  while (true) {
    const now = new Date();
    const next = new Date(now);
    next.setUTCDate(now.getUTCDate() + 1);
    next.setUTCHours(0, 0, 0, 0);
    const ms = next.getTime() - now.getTime();
    log('info', `Sleep until next day: ${Math.floor(ms / 60000)} minutes`);
    await setTimeout(ms);

    const randomDelay = Math.floor(Math.random() * 4 * 60 * 60 * 1000);
    log('info', `Daily delay: ${Math.floor(randomDelay / 60000)} minutes`);
    await setTimeout(randomDelay);

    try {
      await mainFn();
    } catch (e) {
      log('error', `Error (loop): ${e}`);
    }
  }
}
