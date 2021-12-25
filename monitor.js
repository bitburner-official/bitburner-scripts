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
    ns.tail();
    ns.disableLog('ALL');
    while (true) {
        const server = flags._[0];
        let money = ns.getServerMoneyAvailable(server)+1;
        let maxMoney = ns.getServerMaxMoney(server)+1;
        const minSec = ns.getServerMinSecurityLevel(server);
        const sec = ns.getServerSecurityLevel(server);
        ns.clearLog(server);
        ns.print(`${server}:`);
        ns.print(` $_______: ${ns.nFormat(money-1, "$0.000a")} / ${ns.nFormat(maxMoney-1, "$0.000a")} (${((money / maxMoney * 100).toFixed(2))}%)`);
        ns.print(` security: +${(sec - minSec).toFixed(2)}`);
        ns.print(` hack____: ${ns.tFormat(ns.getHackTime(server))} (t=${Math.ceil(ns.hackAnalyzeThreads(server, money))})`);
        if (ns.getServerGrowth(server) < 1) {
            ns.print(` grow____: ${ns.tFormat(ns.getGrowTime(server))} (ERROR GROWTH IS 0)`);
        } else { ns.print(` grow____: ${ns.tFormat(ns.getGrowTime(server))} (t=${Math.ceil(ns.growthAnalyze(server, maxMoney / money))})`) }
        ns.print(` weaken__: ${ns.tFormat(ns.getWeakenTime(server))} (t=${Math.ceil((sec - minSec) * 20)})`);
        await ns.sleep(flags.refreshrate);
    }
}

export function autocomplete(data, args) {
    return data.servers;
}
