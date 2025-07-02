import { normalizeAxiosError } from "@/common/utils/normalizeAxiosError";
import { login } from "./AuthService";
import { setAuthToken } from "./authStore";

import { WalletManager } from "@/services/WalletManager";

export class AuthController {
  async login() {
    const wm = new WalletManager();
    const address = wm.getAddress();
    const sign = await wm.signMessage("pharos");

    const payload = {
      signature: sign,
      address,
      wallet: "MetaMask",
      inviteCode: "",
    };

    try {
      const auth = await login(payload);
      setAuthToken(auth.jwt);
      return {
        token: auth.jwt,
      };
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}
