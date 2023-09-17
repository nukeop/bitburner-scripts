import { CodingContractData, NS } from '@ns';
import { discover } from './lib/server-discovery';
import { solvers } from './lib/contract-solvers';

const solve = (contract: CodingContractData) => {};

export async function main(ns: NS) {
  const servers = discover(ns);
  const contracts = servers.flatMap((server) => {
    const contracts = ns.ls(server, '.cct');
    return contracts.map((contract) => {
      const type = ns.codingcontract.getContractType(contract, server);
      return {
        server,
        type,
        filename: contract,
        data: ns.codingcontract.getData(contract, server),
        description: ns.codingcontract.getDescription(contract, server),
        attemptsLeft: ns.codingcontract.getNumTriesRemaining(contract, server),
        solution: solvers.find((solver) => solver.type === type)?.solve(ns.codingcontract.getData(contract, server)),
      };
    });
  });

  contracts.forEach((contract) => {
    if (contract.solution) {
      ns.tprint(
        `Solved "${contract.type}" on ${contract.server} with solution: ${contract.solution}. Attempts left: ${contract.attemptsLeft}`,
      );
      const reward = ns.codingcontract.attempt(contract.solution, contract.filename, contract.server);
      ns.tprint(`Reward: ${reward}`);
    } else {
      ns.printf('Unsolved: %s', contract.type);
    }
  });

  // ns.tprint(contracts);
}
