import { log } from '@/common/utils/logger';
import { WalletManager } from '@/services/WalletManager';
import { withRetry } from './common/utils/retry';
import { sendTelegramMessage } from '@/common/utils/telegram';

import { FacuetController } from '@/features/faucet/FaucetController';
import { AuthController } from './features/auth/AuthController';

async function main() {
  log('info', 'App started.');

  const wm = new WalletManager();
  const faucet = new FacuetController();
  const auth = new AuthController();

  const address = wm.getAddress();

  await withRetry(() => auth.login(), 'Login');
  await withRetry(() => wm.checkBalance(), 'Balance check');
  await withRetry(() => faucet.requestFaucet(address), 'Faucet request');
}

main().catch(e => log('error', e.message));
