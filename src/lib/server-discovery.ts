import { NS } from '@ns';

export function discover(ns: NS) {
  let visitedServers = ['home'];
  let serversToVisit = ns.scan('home');

  while (serversToVisit.length > 0) {
    const currentServer = serversToVisit.pop();
    if (!currentServer) {
      break;
    }

    const scanResult = ns.scan(currentServer);
    visitedServers = [...visitedServers, currentServer];

    scanResult.forEach((server) => {
      if (!visitedServers.includes(server)) {
        serversToVisit = [...serversToVisit, server];
      }
    });
  }
  return visitedServers;
}
