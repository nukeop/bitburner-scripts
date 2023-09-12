import { discover } from 'discover.lib.js';

/** @param {NS} ns */
export async function main(ns) {
  const servers = discover(ns);

  let maxOpenablePorts = 0;
  if (ns.fileExists('BruteSSH.exe')) {
    maxOpenablePorts++;
  }
  if (ns.fileExists('FTPCrack.exe')) {
    maxOpenablePorts++;
  }

  if (ns.fileExists('relaySMTP.exe')) {
    maxOpenablePorts++;
  }

  if (ns.fileExists('HTTPWorm.exe')) {
    maxOpenablePorts++;
  }

  if (ns.fileExists('SQLInject.exe')) {
    maxOpenablePorts++;
  }

  servers.forEach((server) => {
    if (ns.getServerNumPortsRequired(server) <= maxOpenablePorts) {
      if (ns.fileExists('BruteSSH.exe')) {
        ns.brutessh(server);
      }
      if (ns.fileExists('FTPCrack.exe')) {
        ns.ftpcrack(server);
      }

      if (ns.fileExists('relaySMTP.exe')) {
        ns.relaysmtp(server);
      }

      if (ns.fileExists('HTTPWorm.exe')) {
        ns.httpworm(server);
      }

      if (ns.fileExists('SQLInject.exe')) {
        ns.sqlinject(server);
      }

      ns.nuke(server);

      ns.tprint('Nuked ', server);
    } else {
      ns.tprintf('Skipping %s because it needs more than %s open ports', server, maxOpenablePorts);
    }
  });
}
