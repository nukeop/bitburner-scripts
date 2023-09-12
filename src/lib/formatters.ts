import { NS } from '@ns';

export const formatNumber = (n: number, ns: NS) => {
  return ns.formatNumber(n, 0, 1000, true);
};
