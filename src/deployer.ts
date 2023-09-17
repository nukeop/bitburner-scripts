import { NS } from '@ns';
import { discover } from './lib/server-discovery';

export async function main(ns: NS) {
  const target = ns.args[0].toString() || 'n00dles';
  const servers = discover(ns);
  const securityThresh = ns.getServerMinSecurityLevel(target) + 5;
  const moneyThresh = ns.getServerMaxMoney(target) * 0.75;

  let sleepTime = 3000;
  const ramPerThread = ns.getScriptRam('/shared/weaken.js');

  for (const server of servers) {
    await ns.scp(['/shared/weaken.js', '/shared/grow.js', '/shared/hack.js'], server);
  }

  const RESERVED_RAM = 32;

  while (true) {
    for (const server of servers) {
      let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
      if (server === 'home') {
        ramAvailable -= RESERVED_RAM;
      }
      const threads = Math.floor(ramAvailable / ramPerThread);
      // if (ns.fileExists('Formulas.exe')) {
      //   const neededThreads = 1 / ns.formulas.hacking.hackPercent(ns.getServer(target), ns.getPlayer());
      //   ns.tprintf('%d threads needed to hack %s', neededThreads, target);
      // }

      if (threads > 0) {
        if (
          ns.getServerSecurityLevel(target) > securityThresh ||
          (ns.fileExists('Formulas.exe') && ns.formulas.hacking.hackChance(ns.getServer(target), ns.getPlayer()) < 0.99)
        ) {
          sleepTime = ns.getWeakenTime(target);
          ns.exec('/shared/weaken.js', server, threads, target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
          sleepTime = ns.getGrowTime(target);
          ns.exec('/shared/grow.js', server, threads, target);
        } else {
          sleepTime = ns.getHackTime(target);
          ns.exec('/shared/hack.js', server, threads, target);
        }
      }
    }
    await ns.sleep(sleepTime + 100);
  }
}
