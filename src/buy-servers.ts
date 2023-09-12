import { NS } from '@ns';
import { formatNumber } from './lib/formatters';

export async function main(ns: NS) {
  const BASE_NAME = 'unatco-';
  let lastPurchasedServerNumber = 0;
  const existingServerNames = ns.getPurchasedServers();

  ns.tprintf('Owned servers: %s/%s', ns.getPurchasedServers().length, ns.getPurchasedServerLimit());

  existingServerNames.forEach((server) => {
    const currentRam = ns.getServer(server).maxRam;
    const targetRam = currentRam * 2;
    const upgradeCost = ns.getPurchasedServerUpgradeCost(server, targetRam);
    if (upgradeCost > ns.getPlayer().money) {
      ns.tprintf('Cannot afford upgrading %s, upgrade cost: %s', server, formatNumber(upgradeCost, ns));
      return;
    } else {
      const success = ns.upgradePurchasedServer(server, targetRam);
      if (success) {
        ns.tprintf('Upgraded %s to %sGB RAM', server, targetRam);
      } else {
        ns.tprintf('Could not upgrade %s to %sGB RAM', server, targetRam);
      }
    }
  });

  const serverCost = ns.getPurchasedServerCost(2);
  if (serverCost > ns.getPlayer().money) {
    ns.tprintf(
      'Cannot afford a server. Cost: $%s, money: $%s',
      formatNumber(serverCost, ns),
      formatNumber(ns.getPlayer().money, ns),
    );
    return;
  }
  for (let i = 0; i < ns.getPurchasedServerLimit(); i++) {
    const serverName = BASE_NAME + (lastPurchasedServerNumber + 1).toString().padStart(3, '0');

    if (existingServerNames.includes(serverName)) {
      lastPurchasedServerNumber++;
      continue;
    }
    const purchasedServer = ns.purchaseServer(serverName, 2);
    if (purchasedServer) {
      ns.tprintf('Bought a server: %s', purchasedServer);
    }
    lastPurchasedServerNumber++;
  }
}
