function recursiveScan(ns, parent, server, target, route) {
    const children = ns.scan(server);
    for (let child of children) {
        if (parent == child) {
            continue;
        }
        if (child == target) {
            route.unshift(child);
            route.unshift(server);
            return true;
        }

        if (recursiveScan(ns, server, child, target, route)) {
            route.unshift(server);
            return true;
        }
    }
    return false;
}

export async function main(ns) {
    let route = [];
    let server = ns.args[0];
    if (!server) {
        ns.tprint(`Usage: ${ns.getScriptName()} SERVER`);
        return;
    }

    recursiveScan(ns, '', 'home', server, route);
    for (const i in route) {
        const extra = i > 0 ? "└ " : "";
        ns.tprint(`${" ".repeat(i)}${extra}${route[i]}`);
    }
}

export function autocomplete(data, args) {
    return data.servers;
}