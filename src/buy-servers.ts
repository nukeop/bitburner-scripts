import { NS } from '@ns';
import { formatNumber } from './lib/formatters';
import { minBy } from './lib/utils';

const getCheapestServerToUpgrade = (ns: NS, servers: string[]) => {
  const cheapestServerNameToUpgrade = minBy(servers, (server) => {
    const targetRam = ns.getServer(server).maxRam * 2;
    return ns.getPurchasedServerUpgradeCost(server, targetRam);
  });
  const cheapestServerToUpgrade = ns.getServer(cheapestServerNameToUpgrade);

  return {
    name: cheapestServerNameToUpgrade as string,
    server: cheapestServerToUpgrade,
    cost: ns.getPurchasedServerUpgradeCost(cheapestServerNameToUpgrade as string, cheapestServerToUpgrade.maxRam * 2),
  };
};

const buyMaxServers = (ns: NS) => {
  const BASE_NAME = 'unatco-';
  let lastPurchasedServerNumber = 0;
  const existingServerNames = ns.getPurchasedServers();

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
};

export async function main(ns: NS) {
  ns.tprintf('Owned servers: %s/%s', ns.getPurchasedServers().length, ns.getPurchasedServerLimit());
  buyMaxServers(ns);

  const existingServerNames = ns.getPurchasedServers();
  if (existingServerNames.length === 0) {
    ns.tprint('No servers to upgrade');
    return;
  }

  let cheapestServerToUpgrade = getCheapestServerToUpgrade(ns, existingServerNames);

  ns.tprintf('Cheapest server to upgrade: %s', cheapestServerToUpgrade.name);

  while (
    cheapestServerToUpgrade &&
    ns.getPlayer().money >
      ns.getPurchasedServerUpgradeCost(cheapestServerToUpgrade.name, cheapestServerToUpgrade.server.maxRam * 2)
  ) {
    const success = ns.upgradePurchasedServer(cheapestServerToUpgrade.name, cheapestServerToUpgrade.server.maxRam * 2);
    if (success) {
      ns.tprintf('Upgraded %s to %sGB RAM', cheapestServerToUpgrade.name, cheapestServerToUpgrade.server.maxRam * 2);
      cheapestServerToUpgrade = getCheapestServerToUpgrade(ns, existingServerNames);
    } else {
      ns.tprintf(
        'Could not upgrade %s to %sGB RAM',
        cheapestServerToUpgrade.name,
        cheapestServerToUpgrade.server.maxRam * 2,
      );
      break;
    }
  }

  ns.tprintf(
    "Can't afford to upgrade %s, cost: $%s, current money: $%s",
    cheapestServerToUpgrade.name,
    formatNumber(cheapestServerToUpgrade.cost, ns),
    formatNumber(ns.getPlayer().money, ns),
  );
}
