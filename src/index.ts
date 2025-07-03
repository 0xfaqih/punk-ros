import { log } from '@/common/utils/logger';
import { withRetry } from './common/utils/retry';
import { doDelay } from '@/common/utils/delay';

import { WalletManager } from '@/services/WalletManager';

import { FacuetController } from '@/features/faucet/FaucetController';
import { AuthController } from './features/auth/AuthController';
import { UserController } from './features/user/UserController';
import { sendTelegramMessage } from './common/utils/telegram';
import { runTodayThenRandomDaily } from './common/utils/dailyScheduler';

async function main() {
  log('info', '🚀 App started.');

  const wm = new WalletManager();
  const faucet = new FacuetController();
  const auth = new AuthController();
  const user = new UserController();

  const address = wm.getAddress();

  await withRetry(() => auth.login(), 'Login');
  await withRetry(() => wm.checkBalance(), 'Balance check');
  await withRetry(() => user.getUserXP(address), 'User XP check');

  await doDelay();
  await withRetry(() => faucet.requestFaucet(address), 'Faucet request');

  await doDelay();
  await withRetry(() => user.dailyCheckin(address), 'Daily checkin');

  sendTelegramMessage(`<b> Daily Task Completed.</b>`);
}

runTodayThenRandomDaily(main, { randomDelayToday: true });
