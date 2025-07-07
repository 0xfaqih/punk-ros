import { parseUnits } from "ethers";
import { SwapParams, SwapService } from "./SwapService";
import { WalletManager } from "@/services/WalletManager";
import { ERC20_ADDRESS, ZENITHSWAP } from "@/constants";
import { log } from "@/common/utils/logger";
import { random } from "@/common/utils/random";
import { doDelay } from "@/common/utils/delay";

export class SwapController {
  private swapService: SwapService;
  private wm: WalletManager;

  constructor(walletManager: WalletManager) {
    this.swapService = new SwapService(walletManager);
    this.wm = walletManager;
  }

  async swapOnZenith() {
    const params: SwapParams = {
      tokenIn: ERC20_ADDRESS.WPHRS,
      tokenOut: ERC20_ADDRESS.USDT,
      fee: 500,
      recipient: this.wm.getAddress(),
      amountIn: parseUnits("0.0001", 18),
      amountOutMinimum: parseUnits("0", 6),
      sqrtPriceLimitX96: 0n,
      deadline: Math.floor(Date.now() / 1000) + 600,
      multicallAddress: ZENITHSWAP.SWAP_ROUTER,
    };

    try {
      const getRandom = await random();
      for (let i = 1; i < getRandom; i++) {
        log("info", `swap ${i}`);
        const hash = await this.swapService.sendSwap(params);
        await this.wm.provider.waitForTransaction(hash);
        log("success", `swap success: ${hash}`);
        await doDelay();
      }
    } catch (e: any) {
      log("error", `swap error: ${e}`);
    }
  }
}
