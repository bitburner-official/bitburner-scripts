const HOME 			= 'home'
const LINEBREAK = '\n'
// break server function
/** @param {NS} ns */
/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
	const serv = ns.args[0]
	if(!!serv){
		var portsOppened = 0
		if (ns.fileExists('BruteSSH.exe', HOME)) {
			ns.brutessh(serv)
			portsOppened++
		}
		if (ns.fileExists('FTPCrack.exe', HOME)) {
			ns.ftpcrack(serv)
			portsOppened++
		}
		if (ns.fileExists('relaySMTP.exe', HOME)) {
			ns.relaysmtp(serv)
			portsOppened++
		}
		if (ns.fileExists('HTTPWorm.exe', HOME)) {
			ns.httpworm(serv)
			portsOppened++
		}
		if (ns.fileExists('SQLInject.exe', HOME)) {
			ns.sqlinject(serv)
			portsOppened++
		}
		if (ns.getServerNumPortsRequired(serv) <= portsOppened) {
			ns.nuke(serv)
			//ns.connect(serv)
			//ns.installBackdoor(serv)
		}
		if (ns.hasRootAccess(serv)) { ns.tprint(LINEBREAK + serv + ' has been NUKED') }
		if (!ns.hasRootAccess(serv)) { ns.print(LINEBREAK + serv + ' CANNOT be nuked yet, ' + (ns.getServerNumPortsRequired(serv) - portsOppened) + ' more ports to open') }
	}
}