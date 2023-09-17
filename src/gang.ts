import { GangGenInfo, GangMemberInfo, GangTaskStats, NS } from '@ns';
import { formatNumber } from './lib/formatters';

const getWantedPenalty = (myGangInfo: GangGenInfo) =>
  myGangInfo.respect / (myGangInfo.respect + myGangInfo.wantedLevel);

const getTaskMultiplier = (task: GangTaskStats, member: GangMemberInfo) => {
  let statWeight =
    (task.hackWeight / 100) * member.hack +
    (task.strWeight / 100) * member.str +
    (task.defWeight / 100) * member.def +
    (task.dexWeight / 100) * member.dex +
    (task.agiWeight / 100) * member.agi +
    (task.chaWeight / 100) * member.cha;

  statWeight -= 3.2 * task.difficulty;
  return statWeight;
};
const getAscendTreshold = (member: GangMemberInfo) => {
  const mult = member.hack_asc_mult;
  if (mult < 1.632) return 1.6326;
  if (mult < 2.336) return 1.4315;
  if (mult < 2.999) return 1.284;
  if (mult < 3.363) return 1.2125;
  if (mult < 4.253) return 1.1698;
  if (mult < 4.86) return 1.1428;
  if (mult < 5.455) return 1.1225;
  if (mult < 5.977) return 1.0957;
  if (mult < 6.496) return 1.0869;
  if (mult < 7.008) return 1.0789;
  if (mult < 7.519) return 1.073;
  if (mult < 8.025) return 1.0673;
  if (mult < 8.513) return 1.0631;
  if (mult < 20) return 1.0591;
  return 1.04;
};

export async function main(ns: NS) {
  const gangInfo = ns.gang.getGangInformation();
  const wantedPenalty = getWantedPenalty(gangInfo);
  let memberIndex = ns.gang.getMemberNames().length;

  while (ns.gang.canRecruitMember()) {
    const name = 'g' + memberIndex.toString();
    ns.gang.recruitMember(name);
    ns.gang.setMemberTask(name, 'Train Hacking');
    memberIndex++;
  }

  const members = ns.gang.getMemberNames().map((name) => ns.gang.getMemberInformation(name));

  for (const member of members) {
    const tasks = ns.gang
      .getTaskNames()
      .map((_name) => ns.gang.getTaskStats(_name))
      .filter((task) => task.isHacking)
      .sort((taskA, taskB) => {
        if (ns.fileExists('Formulas.exe')) {
          return (
            ns.formulas.gang.moneyGain(gangInfo, member, taskB) - ns.formulas.gang.moneyGain(gangInfo, member, taskA)
          );
        } else {
          return (
            getTaskMultiplier(taskB, member) * taskB.baseMoney - getTaskMultiplier(taskA, member) * taskA.baseMoney
          );
        }
      });
    const mostProfitableTask = tasks[0];

    if (member.hack < 100) {
      ns.gang.setMemberTask(member.name, 'Train Hacking');
    } else if (wantedPenalty < 0.95) {
      ns.gang.setMemberTask(member.name, 'Ethical Hacking');
    } else {
      ns.gang.setMemberTask(member.name, mostProfitableTask.name);
    }

    const ascendResult = ns.gang.getAscensionResult(member.name);

    if (ascendResult && ascendResult?.hack > getAscendTreshold(member)) {
      ns.gang.ascendMember(member.name);
    }

    // Buy cheapest equipment
    ns.gang
      .getEquipmentNames()
      .sort((eqA, eqB) => {
        const costA = ns.gang.getEquipmentCost(eqA);
        const costB = ns.gang.getEquipmentCost(eqB);
        return costA - costB;
      })
      .forEach((equipment) => {
        if (!member.upgrades.includes(equipment)) {
          const stats = ns.gang.getEquipmentStats(equipment);

          if (stats.hack) {
            const cost = ns.gang.getEquipmentCost(equipment);
            if (cost < ns.getPlayer().money) {
              ns.gang.purchaseEquipment(member.name, equipment);
              ns.tprintf('Buying %s for %s, cost: $%s', equipment, member.name, formatNumber(cost, ns));
            }
          }
        }
      });
  }
}
