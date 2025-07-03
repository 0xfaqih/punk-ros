import { ethers } from "ethers";

import { config } from "@/config/config";
import { log } from "@/common/utils/logger";

export class WalletManager {
  provider: ethers.JsonRpcProvider;
  wallet: ethers.Wallet;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      config.rpcUrl,
      {
        name: "pharos",
        chainId: 688688,
      },
      { staticNetwork: true }
    );
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);
  }

  async checkBalance() {
    const balance = await this.provider.getBalance(this.wallet.address);
    log("info", `Balance: ${ethers.formatEther(balance)} PHRS`);
    return balance;
  }

  getAddress() {
    return this.wallet.address;
  }

  async signMessage(message: string) {
    return await this.wallet.signMessage(message);
  }

  async sendToFriend(
    to: string,
    amount: string,
    counter: number
  ): Promise<string> {
    try {
      const nonce = await this.provider.getTransactionCount(
        this.wallet.address
      );
      const tx = await this.wallet.sendTransaction({
        to,
        value: ethers.parseEther(amount),
        gasLimit: 23000,
        nonce,
      });
      log("success", `${counter}. Transaction sent to ${to}`);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      log("error", `${counter}. Failed to send transaction to ${to}: ${error}`);
      throw error;
    }
  }
}
