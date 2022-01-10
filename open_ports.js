/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false], ['ports', 0]]);
    const host = args._[0];
    ns.tprint(JSON.stringify(args));
    if (args.help || !host) {
        const help = `
This script will open ports on a target server.
USAGE: run ${ns.getScriptName()} SERVER_NAME

FLAGS:
--help		Display this message.
--ports	n	Optional, the number of ports to open [1,5].	

Example:
> run ${ns.getScriptName()} n00dles --ports 3
`;
        ns.tprint(help);
        return;
    }

    if (!ns.serverExists(host)) {
        ns.tprint('Error: Host (' + host + ') doesn\'t exists');
        return;
    }

    if (!Number.isInteger(args.ports)) {
        ns.tprint('Error: Ports must be an integer');
        return;
    }

    const ports = args.ports === 0 ? null : args.ports
    if (ports && (ports > 5 || ports < 0)) {
        ns.tprint('Error: Amount of ports must be between 0 and 5');
        return;
    }

    const portsCracker = new PortsCracker(ns);
    const result = portsCracker.crackPorts(host, ports);
    const msg = `
Ports required for hack: ${result.portsRequiredForHack}
Already opened ports: ${JSON.stringify(result.wasOpened)}
Opened ports: ${JSON.stringify(result.opened)}
Unable to open ports: ${JSON.stringify(result.unableToOpen)};
`;
    ns.tprint(msg);
}

export class PortsCracker {
    /** @param {NS} ns **/
    constructor(ns) {
        this.ns = ns;
    }

    /** 
     * @param {string} host Name of the server
     * @param {number} num Number of ports to crack (optional)
     */
    crackPorts(host, num) {
        const ns = this.ns;
        const portsRequiredForHack = ns.getServerNumPortsRequired(host);

        if (!num) num = portsRequiredForHack;
        if (num > 5 || num < 0) throw new Error('crackPorts: Invalid argument: ports must be between 1 and 5');

        const server = ns.getServer(host);
        const ports = [
            {
                name: 'ssh',
                crack: () => ns.brutessh(host),
                isOpened: server.sshPortOpen,
                ableToOpen: ns.fileExists('BruteSSH.exe', 'home'),
            },
            {
                name: 'ftp',
                crack: () => ns.ftpcrack(host),
                isOpened: server.ftpPortOpen,
                ableToOpen: ns.fileExists('FTPCrack.exe', 'home'),
            },
            {
                name: 'smtp',
                crack: () => ns.relaysmtp(host),
                isOpened: server.smtpPortOpen,
                ableToOpen: ns.fileExists('relaySMTP.exe', 'home'),
            },
            {
                name: 'http',
                crack: () => ns.httpworm(host),
                isOpened: server.httpPortOpen,
                ableToOpen: ns.fileExists('HTTPWorm.exe', 'home'),
            },
            {
                name: 'sql',
                crack: () => ns.sqlinject(host),
                isOpened: server.sqlPortOpen,
                ableToOpen: ns.fileExists('SQLInject.exe', 'home'),
            },
        ]
        const opened = [];
        const unableToOpen = [];

        for (let i = 0; i < num; i++) {
            if (!ports[i].ableToOpen) {
                ns.print('crackPorts: unable to open port ' + ports[i].name);
                unableToOpen.push(ports[i].name);
                continue;
            }
            if (ports[i].isOpened) {
                ns.print('crackPorts: ' + ports[i].name + ' is already opened');
                continue;
            }

            ports[i].crack();
            ns.print('crackPorts: open port ' + ports[i].name);
            opened.push(ports[i].name);
        }

        return {
            portsRequiredForHack,
            opened,
            wasOpened: ports.filter((p) => p.isOpened).map((p) => p.name),
            unableToOpen,
        };
    }
}
