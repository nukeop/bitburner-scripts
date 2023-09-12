import { discover } from 'discover.lib.js';
/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0] || 'n00dles';
  const servers = discover(ns);
  let securityThresh = ns.getServerMinSecurityLevel(target) + 5;
  let moneyThresh = ns.getServerMaxMoney(target) * 0.75;

  let sleepTime = 3000;
  let ramPerThread = ns.getScriptRam('/shared/weaken.js');

  for (let server of servers) {
    await ns.scp(['/shared/weaken.js', '/shared/grow.js', '/shared/hack.js'], server);
  }

  while (true) {
    for (let server of servers) {
      let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
      let threads = Math.floor(ramAvailable / ramPerThread);

      if (threads > 0) {
        // if (ns.getServerSecurityLevel(target) > securityThresh || ns.formulas.hacking.hackChance(ns.getServer(target), ns.getPlayer()) > 0.99) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
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
