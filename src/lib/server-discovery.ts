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

    serversToVisit = [...serversToVisit, ...scanResult.filter((server) => !visitedServers.includes(server))];
  }
  return visitedServers;
}
