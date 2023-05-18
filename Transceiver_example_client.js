import { Transceiver } from "Transceiver.js";
const PORT_REQUEST = 1;
const PORT_RESPONSE = 2;
/** @param {NS} ns */
export async function main(ns) {
    /** @type {Transceiver} */
    const port = new Transceiver(ns, "tranceiver-example-client", PORT_REQUEST, PORT_RESPONSE);
    ns.clearLog();
    ns.tail();
    ns.atExit(() => {
        ns.printf("Script is being terminated");
        ns.printf(`Statistics: ${JSON.stringify(port.getStatistics(), null, "  ")} }`);
    });
    while (true) {
        let t0 = Date.now();
        let msgId = await port.send("tranceiver-example-server", "question");
        if (msgId) {
            let msg = await port.receive(msgId);
            if (msg) {
                ns.printf(new Date().toISOString() + " - " + `Received answer: ${JSON.stringify(msg)} after ${ns.tFormat(Date.now() - t0, true)}`);
            }
            else {
                ns.print(new Date().toISOString() + " - " + "No one responded");
            }
        }
        else {
            ns.print(new Date().toISOString() + " - " + "Timeout sending");
        }
        await new Promise(r => setTimeout(r, 1000));
    }
}
