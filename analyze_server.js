export async function main(ns) {
  const args = ns.flags([["help", false]]);
  const server = ns.args[0];
  if (args.help || !server) {
    ns.tprint("This script does a more detailed analysis of a server.");
    ns.tprint(`Usage: run ${ns.getScriptName()} SERVER`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} n00dles`);
    return;
  }
  // [total ram, used ram]
  const ram = [ns.getServerMaxRam(server),
  ns.getServerMaxRam(server) - ns.getServerUsedRam(server)];
  const money = ns.getServerMoneyAvailable(server);
  const maxMoney = ns.getServerMaxMoney(server);
  const minSec = ns.getServerMinSecurityLevel(server);
  const sec = ns.getServerSecurityLevel(server);
  ns.tprint(`

${server}:
    RAM        : ${ns.format.ram(ram[1])} / ${ns.format.ram(ram[0])} (${ns.format.percent(ram[1] / ram[0])})
    \$          : \$${ns.format.number(money, 1)} / \$${ns.format.number(maxMoney, 1)} (${ns.format.percent(money / maxMoney)})
    security   : ${minSec.toFixed(2)} / ${sec.toFixed(2)}
    growth     : ${ns.getServerGrowth(server)}
    hack time  : ${ns.format.time(ns.getHackTime(server))}
    grow time  : ${ns.format.time(ns.getGrowTime(server))}
    weaken time: ${ns.format.time(ns.getWeakenTime(server))}
    grow x2    : ${ns.format.number(ns.growthAnalyze(server, 2), 2)} threads
    grow x3    : ${ns.format.number(ns.growthAnalyze(server, 3), 2)} threads
    grow x4    : ${ns.format.number(ns.growthAnalyze(server, 4), 2)} threads
    hack 10%   : ${ns.format.number(.10 / ns.hackAnalyze(server), 2)} threads
    hack 25%   : ${ns.format.number(.25 / ns.hackAnalyze(server), 2)} threads
    hack 50%   : ${ns.format.number(.50 / ns.hackAnalyze(server), 2)} threads
    hackChance : ${ns.format.percent(ns.hackAnalyzeChance(server))}
`);
}
