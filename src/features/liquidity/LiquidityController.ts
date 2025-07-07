import { parseUnits } from "ethers";
import { LiquidityService, AddLPParams } from "./LiquidityService";
import { WalletManager } from "@/services/WalletManager";
import { ERC20_ADDRESS, LIQUIDITY_POSITION_MANAGER } from "@/constants";
import { log } from "@/common/utils/logger";
import { random } from "@/common/utils/random";
import { doDelay } from "@/common/utils/delay";

export class LiquidityController {
  private liquidityService: LiquidityService;
  private wm: WalletManager;

  constructor(walletManager: WalletManager) {
    this.liquidityService = new LiquidityService(walletManager);
    this.wm = walletManager;
  }

  async addLPExample() {
    const params: AddLPParams = {
      token0: ERC20_ADDRESS.WPHRS,
      token1: ERC20_ADDRESS.USDT,
      fee: 500, 
      tickLower: -60000, 
      tickUpper: 60000,  
      amount0Desired: parseUnits("0.0001", 18),
      amount1Desired: parseUnits("0.01", 6),
      amount0Min: 0n,
      amount1Min: 0n,
      recipient: this.wm.getAddress(),
      deadline: Math.floor(Date.now() / 1000) + 600,
      positionManager: LIQUIDITY_POSITION_MANAGER,
    };

    try {
      const getRandom = await random();
      for (let i = 1; i < getRandom; i++) {
        log("info", `add LP ${i}`);
        const hash = await this.liquidityService.addLiquidity(params);
        await this.wm.provider.waitForTransaction(hash);
        log("success", `add LP success: ${hash}`);
        await doDelay();
      }
      const hash = await this.liquidityService.addLiquidity(params);
      await this.wm.provider.waitForTransaction(hash);
      log("success", `add LP success: ${hash}`);
    } catch (e: any) {
      log("error", `add LP error: ${e}`);
    }
  }
}
