import { NS } from '@ns';
import { discover } from './lib/server-discovery';

export async function main(ns: NS) {
  const servers = discover(ns);
  ns.tprint(servers);
}
