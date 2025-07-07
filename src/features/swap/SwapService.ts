import { ethers, Contract, Interface } from "ethers";
import { WalletManager } from "@/services/WalletManager";
import { ABI_multiCall, ERC20_ABI, swapAbi } from "@/constants";


export interface SwapParams {
  tokenIn: string;
  tokenOut: string;
  fee: number;
  recipient: string;
  amountIn: bigint;
  amountOutMinimum: bigint;
  sqrtPriceLimitX96: bigint;
  deadline: number;
  multicallAddress: string;
}

export class SwapService {
  private walletManager: WalletManager;

  constructor(walletManager: WalletManager) {
    this.walletManager = walletManager;
  }

  private getTokenContract(address: string) {
    return new Contract(address, ERC20_ABI, this.walletManager.wallet);
  }

  private encodeSwapCall(params: SwapParams): string {
    const iface = new Interface(swapAbi);
    return iface.encodeFunctionData("exactInputSingle", [{
      tokenIn: params.tokenIn,
      tokenOut: params.tokenOut,
      fee: params.fee,
      recipient: params.recipient,
      amountIn: params.amountIn,
      amountOutMinimum: params.amountOutMinimum,
      sqrtPriceLimitX96: params.sqrtPriceLimitX96
    }]);
  }

  private encodeMulticall(deadline: number, swapData: string): string {
    const iface = new Interface(ABI_multiCall);
    return iface.encodeFunctionData("multicall", [deadline, [swapData]]);
  }

  async ensureAllowance(token: Contract, spender: string, amount: bigint) {
    const allowance: bigint = await token.allowance(this.walletManager.getAddress(), spender);
    if (allowance < amount) {
      const tx = await token.approve(spender, amount);
      await tx.wait();
      return true;
    }
    return false;
  }

  async sendSwap(params: SwapParams): Promise<string> {
    const token = this.getTokenContract(params.tokenIn);
    const balance: bigint = await token.balanceOf(this.walletManager.getAddress());
    if (balance < params.amountIn) throw new Error("Balance kurang dari amountIn!");

    await this.ensureAllowance(token, params.multicallAddress, params.amountIn);

    const swapData = this.encodeSwapCall(params);
    const multicallData = this.encodeMulticall(params.deadline, swapData);

    let gasEstimate: bigint;
    try {
      gasEstimate = await this.walletManager.provider.estimateGas({
        to: params.multicallAddress,
        data: multicallData,
        from: this.walletManager.getAddress(),
        value: 0
      }) as unknown as bigint;
      gasEstimate = gasEstimate * 12n / 10n;
    } catch {
      gasEstimate = 1_500_000n;
    }

    const tx = await this.walletManager.wallet.sendTransaction({
      to: params.multicallAddress,
      data: multicallData,
      gasLimit: gasEstimate,
      value: 0 
    });
    await tx.wait();
    return tx.hash;
  }
}
