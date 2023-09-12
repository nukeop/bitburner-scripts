/** @param {NS} ns */
export function discover(ns) {
  let visitedServers = ['home'];
  let serversToVisit = ns.scan('home');

  while (serversToVisit.length > 0) {
    const currentServer = serversToVisit.pop();

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
