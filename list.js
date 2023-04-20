/** @param {NS} ns **/

export function scan(ns) {
    ns.disableLog("scan");
    function subscan(ns, parent, server, list) {
        const children = ns.scan(server);
        for (let child of children) {
            if (parent == child) {
                continue;
            }
            list.push(child);
            subscan(ns, server, child, list);
        }
    }
    const l = [];
    subscan(ns, '', 'home', l);
    return l;
}

export function showServerInfo(ns, servers) {
    servers.sort((a, b) => a.requiredHackingSkill - b.requiredHackingSkill);
    ns.tprint("-".padStart(80, "-"));
    ns.tprint(
        "SERVERNAME".padStart(20),
        "LEVEL".padStart(10),
        "HACKED".padStart(10),
        "BACKDOOR".padStart(10),
        "CASH".padStart(10),
        "RAM".padStart(10),
        "TURTLES".padStart(10)
    );

    ns.tprint("-".padStart(80, "-"));

    servers.forEach(s => ns.tprint(
        s.hostname.padStart(20),
        ns.nFormat(s.requiredHackingSkill, '0').padStart(10),
        (s.hasAdminRights) ? "\u01a6oot".padStart(10) : "".padStart(10),
        (s.backdoorInstalled) ? "\u0138it".padStart(10) : "".padStart(10),
        ns.nFormat(s.moneyAvailable, "0.0a").padStart(10),
        ns.nFormat(Math.ceil(s.ramUsed / s.maxRam), '0%').padStart(10),
        "LIKES".padStart(10)
    ));
}

export async function main(ns) {
    var servers = [];
    scan(ns).forEach(s => servers.push(ns.getServer(s)));
    showServerInfo(ns, servers);
}
