import { NS } from '@ns';

const GANG_SCRIPT = 'gang.js';

export async function main(ns: NS) {
  while (true) {
    await ns.sleep(5000);
    ns.exec(GANG_SCRIPT, 'home');
  }
}
