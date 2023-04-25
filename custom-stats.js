/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("sleep");
    const args = ns.flags([["help", false]]);
    if (args.help) {
        ns.tprint("This script will enhance your HUD (Heads up Display) with custom statistics.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }
    
    const doc = document; // This is expensive! (25GB RAM) Perhaps there's a way around it? ;)
    const hook0 = doc.getElementById('overview-extra-hook-0');
    const hook1 = doc.getElementById('overview-extra-hook-1');
    while (true) {
        try {
            const headers = []
            const values = [];
            // Add script income per second
            headers.push("Script inc");
            values.push(ns.nFormat(ns.getScriptIncome()[0], "0.000a") + "/s");
            // Add script exp gain rate per second
            headers.push("Script exp");
            values.push(ns.nFormat(ns.getScriptExpGain(), "0.000a") + "/s");
            // TODO: Add more neat stuff

            // Now drop it into the placeholder elements
            hook0.innerText = headers.join(" \n");
            hook1.innerText = values.join("\n");
        } catch (err) { // This might come in handy later
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        await ns.sleep(1000);
    }
}
