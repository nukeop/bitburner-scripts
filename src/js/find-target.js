import { discover } from 'discover.lib.js';

/** @param {NS} ns */
export async function main(ns) {
  let servers = discover(ns);
  const player = ns.getPlayer();

  const serversWithScore = servers
    .map((server) => {
      let score = 0;
      const serverObj = ns.getServer(server);
      if (ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
        if (ns.fileExists('Formulas.exe')) {
          score =
            ns.getServerMaxMoney(server) /
            (ns.formulas.hacking.hackTime(serverObj, player) * ns.formulas.hacking.hackChance(serverObj, player));
        } else {
          score = ns.getServerMaxMoney(server) / ns.getHackTime(server);
        }
      }

      return {
        server,
        score,
      };
    })
    .filter((server) => server.score > 0)
    .filter((server) => ns.hasRootAccess(server.server));

  const sortedServers = serversWithScore.sort((serverA, serverB) => {
    return serverB.score - serverA.score;
  });

  const serverTable = sortedServers.map(({ server, score }) => ({
    server,
    hackTime: ns.formatNumber(ns.getHackTime(server), 0, 1000, true),
    score: ns.formatNumber(score, 2, 1000, true),
    maxCash: ns.formatNumber(ns.getServerMaxMoney(server), 2, 1000, true),
  }));

  ns.tprintRaw(
    React.createElement('table', {}, [
      React.createElement('thead', {}, [
        React.createElement('tr', {}, [
          React.createElement('th', {}, 'Server'),
          React.createElement('th', {}, 'Hack time'),
          React.createElement('th', {}, 'Max cash'),
          React.createElement('th', {}, 'Score'),
        ]),
      ]),
      React.createElement(
        'tbody',
        {},
        serverTable.map((row) =>
          React.createElement('tr', {}, [
            React.createElement('td', {}, row.server),
            React.createElement('td', {}, row.hackTime),
            React.createElement('td', {}, row.maxCash),
            React.createElement('td', {}, row.score),
          ]),
        ),
      ),
    ]),
  );
}
