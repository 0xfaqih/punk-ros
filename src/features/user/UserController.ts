import { normalizeAxiosError } from "@/common/utils/normalizeAxiosError";
import { UserService } from "./UserService";
import { sendTelegramMessage } from "@/common/utils/telegram";
import { log } from "@/common/utils/logger";
import { WalletManager } from "@/services/WalletManager";
import { loadAddresses } from "@/common/utils/addressLoader";
import { random, selectRandomUnique } from "@/common/utils/random";
import { doDelay } from "@/common/utils/delay";
import { withRetry } from "@/common/utils/retry";

export class UserController {
  private service: UserService;
  constructor() {
    this.service = new UserService();
  }

  async getUserXP(address: string) {
    try {
      const resp = await this.service.userProfile(address);
      sendTelegramMessage(
        `<b>${address}</b> has ${resp.user_info.TotalPoints} XP`
      );
      log("info", `Total points: ${resp.user_info.TotalPoints} XP`);
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async dailyCheckin(address: string) {
    try {
      const resp = await this.service.checkinStatus(address);
      const result = await this.service.dailyCheckin(address);
      if (result.msg === "ok") {
        log("success", "Daily checkin successful.");
      } else {
        log("error", `Daily checkin failed: ${result.msg}`);
      }
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async verifyTask(address: string, task_id: number, tx_hash: string) {
    try {
      const result = await this.service.verifyTask(address, task_id, tx_hash);
      if (result.data.verified) {
        log("success", "Task verified successfully.");
      } else {
        log("error", "Task verification failed.");
        log("error", result.msg);
      }
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async sendToFriends() {
    const wm = new WalletManager();
    const address = wm.getAddress();
    const addresses = loadAddresses();
    const numRecipients = await random();
    const recipients = selectRandomUnique(addresses, numRecipients);
    const amount = "0.001";

    log("info", `Sending ${amount} PHRS to ${numRecipients} recipients...`);
    for (let i = 0; i < numRecipients; i++) {
      try {
        const txHash = await withRetry(() =>
          wm.sendToFriend(recipients[i], amount, i + 1)
        );
        if (txHash) {
          await withRetry(() => this.verifyTask(address, 103, txHash));
        }
        log("success", `Recipient ${recipients[i]} success`);
      } catch (err) {
        log("error", `Recipient ${recipients[i]} gagal:` + err);
      }
      await doDelay();
    }

    log("success", `Sent to all successfully.`);
  }
}
