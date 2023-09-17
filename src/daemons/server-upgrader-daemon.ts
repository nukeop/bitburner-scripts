import { NS } from '@ns';

const BUY_SERVERS_SCRIPT = 'buy-servers.js';

export async function main(ns: NS) {
  while (true) {
    await ns.sleep(10000);
    ns.exec(BUY_SERVERS_SCRIPT, 'home');
  }
}
