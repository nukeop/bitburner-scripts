import { NS } from '@ns';

const CONTRACTS_SCRIPT = 'contracts.js';

export async function main(ns: NS) {
  while (true) {
    await ns.sleep(5000);
    ns.exec(CONTRACTS_SCRIPT, 'home');
  }
}
