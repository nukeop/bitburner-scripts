import { NS } from '@ns';
import { discover } from './lib/server-discovery';
import { formatNumber } from './lib/formatters';

export async function main(ns: NS) {
  const servers = discover(ns);
  const player = ns.getPlayer();

  const serversWithScore = servers
    .filter((server) => ns.hasRootAccess(server))
    .map((server) => {
      let score = 0;
      const serverObj = ns.getServer(server);
      if (ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
        if (ns.fileExists('Formulas.exe')) {
          const minimumSecurityLevel = ns.getServerMinSecurityLevel(server);

          // Hack chance when security is at minimum
          const hackChance = ns.formulas.hacking.hackChance(
            {
              ...serverObj,
              hackDifficulty: minimumSecurityLevel,
            },
            player,
          );

          // ns.tprintf(
          //   'Hypothetical hack chance for %s at security level %d is %s',
          //   server,
          //   minimumSecurityLevel,
          //   hackChance,
          // );

          if (hackChance > 0) {
            score = ns.getServerMaxMoney(server) / (ns.formulas.hacking.hackTime(serverObj, player) * hackChance);
          }
        } else {
          const hackChance = ns.hackAnalyzeChance(server);
          score = ns.getServerMaxMoney(server) / (ns.getHackTime(server) * hackChance);
        }
      }

      return {
        server,
        score,
      };
    })
    .filter((server) => server.score > 0);

  const sortedServers = serversWithScore.sort((serverA, serverB) => {
    return serverB.score - serverA.score;
  });

  const serverTable = sortedServers.map(({ server, score }) => ({
    server,
    hackTime: formatNumber(ns.getHackTime(server), ns),
    score: formatNumber(score, ns),
    maxCash: formatNumber(ns.getServerMaxMoney(server), ns),
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
