import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  accountName: process.env.ACCOUNT_NAME || "default_account",

  rpcUrl: process.env.RPC_URL || "https://testnet.dplabs-internal.com",
  baseURL: process.env.BASE_URL || "https://api.pharosnetwork.xyz",
  privateKey: process.env.PRIVATE_KEY || "",
  twoCaptchaKey: process.env.TWOCAPTCHA_KEY || "",

  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
  telegramChatId: process.env.TELEGRAM_CHAT_ID || "",
  telegramThreadId: process.env.TELEGRAM_THREAD_ID || "",

  maxRetries: Number(process.env.MAX_RETRIES) || 5,
  retryCooldownMs: Number(process.env.RETRY_COOLDOWN_MS) || 10000,
};