export async function main(ns) {
  const flags = ns.flags([
    ['refreshrate', 200],
    ['help', false],
  ])
  if (flags._.length === 0 || flags.help) {
    ns.tprint("This script helps visualize the money and security of a server.");
    ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} n00dles`)
    return;
  }
  ns.ui.openTail();
  ns.disableLog('ALL');
  while (true) {
    const server = flags._[0];
    let money = ns.getServerMoneyAvailable(server);
    if (money === 0) money = 1;
    const maxMoney = ns.getServerMaxMoney(server);
    const minSec = ns.getServerMinSecurityLevel(server);
    const sec = ns.getServerSecurityLevel(server);
    ns.clearLog(server);
    ns.print(`${server}:`);
    ns.print(` \$_______: \$${ns.format.number(money, 2)} / \$${ns.format.number(maxMoney, 2)} (${ns.format.percent(money / maxMoney)})`);
    ns.print(` security: +${ns.format.number(sec - minSec)}`);
    ns.print(` hack____: ${ns.format.time(ns.getHackTime(server))} (t=${Math.ceil(ns.hackAnalyzeThreads(server, money))})`);
    ns.print(` grow____: ${ns.format.time(ns.getGrowTime(server))} (t=${Math.ceil(ns.growthAnalyze(server, maxMoney / money))})`);
    ns.print(` weaken__: ${ns.format.time(ns.getWeakenTime(server))} (t=${Math.ceil((sec - minSec) * 20)})`);
    await ns.sleep(flags.refreshrate);
  }
}

export function autocomplete(data, args) {
  return data.servers;
}
