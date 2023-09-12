import { NS } from '@ns';
import { discover } from './lib/server-discovery';

export async function main(ns: NS): Promise<void> {
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
    if (ns.getServerNumPortsRequired(server) <= maxOpenablePorts && !ns.hasRootAccess(server)) {
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
    }
  });
}
