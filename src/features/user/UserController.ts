import { normalizeAxiosError } from "@/common/utils/normalizeAxiosError";
import { UserService } from "./UserService";
import { sendTelegramMessage } from "@/common/utils/telegram";
import { log } from "@/common/utils/logger";

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
      if (resp.data.status === "1102222") {
        const result = await this.service.dailyCheckin(address);
        if (result.msg === "ok") {
          log("success", "Daily checkin successful.");
        } else {
          log("error", `Daily checkin failed: ${result.msg}`);
        }
      } else if (resp.data.status === "1100222") {
        log("warn", "Already checked in today.");
      }
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}
