import { ethers } from "ethers";

import { config } from "@/config/config";
import {log} from "@/common/utils/logger";

export class WalletManager {
  provider: ethers.JsonRpcProvider;
  wallet: ethers.Wallet;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
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
}
