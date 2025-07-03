import { log } from "@/common/utils/logger";
import { normalizeAxiosError } from "@/common/utils/normalizeAxiosError";
import { solveRecaptchaV2 } from "@/common/utils/solveRecaptcha";
import { FaucetService } from "@/features/faucet/FaucetServices";

export class FacuetController {
  private service: FaucetService;

  constructor() {
    this.service = new FaucetService();
  }

  async requestFaucet(address: string) {
    try {
      const resp = await this.service.checkEligibility(address);
      if (resp.is_able_to_faucet) {
        log("info", "Requesting faucet...");
        // await solveRecaptchaV2();

        const result = await this.service.getFaucet(address);
        if (result.msg === "ok") {
          log("success", "Faucet request successful.");
        } else {
          log("error", `Faucet request failed: ${result.msg}`);
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}
