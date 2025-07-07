import { Contract, Interface, ethers } from "ethers";
import { WalletManager } from "@/services/WalletManager";
import { LIQUIDITY_ABI, ERC20_ABI } from "@/constants";

export interface AddLPParams {
  token0: string;
  token1: string;
  fee: number;
  tickLower: number;
  tickUpper: number;
  amount0Desired: bigint;
  amount1Desired: bigint;
  amount0Min: bigint;
  amount1Min: bigint;
  recipient: string;
  deadline: number;
  positionManager: string;
}

export class LiquidityService {
  private walletManager: WalletManager;

  constructor(walletManager: WalletManager) {
    this.walletManager = walletManager;
  }

  private getTokenContract(address: string) {
    return new Contract(address, ERC20_ABI, this.walletManager.wallet);
  }

  private getPositionManager(address: string) {
    return new Contract(address, LIQUIDITY_ABI, this.walletManager.wallet);
  }

  async ensureAllowance(tokenAddress: string, spender: string, amount: bigint) {
    const token = this.getTokenContract(tokenAddress);
    const allowance: bigint = await token.allowance(this.walletManager.getAddress(), spender);
    if (allowance < amount) {
      const tx = await token.approve(spender, amount);
      await tx.wait();
      return true;
    }
    return false;
  }

  async addLiquidity(params: AddLPParams): Promise<string> {
    // 1. Approve token0 & token1
    await this.ensureAllowance(params.token0, params.positionManager, params.amount0Desired);
    await this.ensureAllowance(params.token1, params.positionManager, params.amount1Desired);

    // 2. Call mint
    const positionManager = this.getPositionManager(params.positionManager);

    const mintParams = {
      token0: params.token0,
      token1: params.token1,
      fee: params.fee,
      tickLower: params.tickLower,
      tickUpper: params.tickUpper,
      amount0Desired: params.amount0Desired,
      amount1Desired: params.amount1Desired,
      amount0Min: params.amount0Min,
      amount1Min: params.amount1Min,
      recipient: params.recipient,
      deadline: params.deadline,
    };

    const tx = await positionManager.mint(mintParams, {
      gasLimit: 2_000_000,
    });
    await tx.wait();
    return tx.hash;
  }
}
