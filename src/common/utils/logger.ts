import chalk from 'chalk';
import { sendTelegramMessage } from '@/common/utils/telegram';

type LogType = 'info' | 'warn' | 'error' | 'success';

const colorByType = {
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
  success: chalk.green,
};

export function log(type: LogType, message: string) {
  const prefix = `[${type.toUpperCase()}]`;
  // @ts-ignore
  console.log(colorByType[type](prefix), message);
  if (type === "error") {
    sendTelegramMessage(`<b>🚨 ERROR</b> <pre>${message}</pre>`);
  }
}