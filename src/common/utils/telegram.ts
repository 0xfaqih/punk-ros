import axios from "axios";

import { config } from "@/config/config";
import {log} from "@/common/utils/logger";

export async function sendTelegramMessage(html: string) {
  const prefix = `<b>[${config.accountName}]</b>\n\n`;
  try {
    await axios.post(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
      chat_id: config.telegramChatId,
      message_thread_id: config.telegramThreadId || undefined,
      text: prefix + html,
      parse_mode: "HTML",
    });
    log("success", "Telegram notification sent.");
  } catch (e: any) {
    log("error", `Failed to send telegram message: ${e.message || e}`);
  }
}
