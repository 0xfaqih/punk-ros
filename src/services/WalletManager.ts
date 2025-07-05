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
    const balance = await this.provider.getBalance(
      this.wallet.address,
      "pending"
    );
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
    function promiseTimeout(promise: Promise<any>, ms: number) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout!')), ms))
  ]);
}

    try {
      const nonce = await this.provider.getTransactionCount(
        this.wallet.address
      );

      const txParams: any = {
        to,
        value: ethers.parseEther(amount),
        gasLimit: 23000,
        nonce,
      };
      const tx = await this.wallet.sendTransaction(txParams);

      log("info", `${counter}. Transaction sent to ${to}`);
       await promiseTimeout(tx.wait(), 60_000); 
      return tx.hash;
    } catch (error) {
      log("error", `${counter}. Failed to send transaction to ${to}: ${error}`);
      throw error;
    }
  }
}
