import { Transceiver } from "Transceiver.js";
const PORT_REQUEST = 1;
const PORT_RESPONSE = 2;
/** @param {NS} ns */
export async function main(ns) {
    /** @type {Transceiver} */
    const port = new Transceiver(ns, "tranceiver-example-server", PORT_RESPONSE, PORT_REQUEST);
    ns.clearLog();
    ns.tail();
    ns.atExit(() => {
        ns.printf("Script is being terminated");
        ns.printf(`Statistics: ${JSON.stringify(port.getStatistics(), null, "  ")} }`);
    });
    let lmt = Date.now();
    // Forever
    while (true) {
        // Receive message
        let msg = await port.receive();
        if (msg) {
            lmt = Date.now();
            // Send answer. Use same message id.
            await port.send(msg.source, { text: "answer", number: 1234 }, msg.id);
        }
        else {
            let forTime = ns.tFormat(Date.now() - lmt);
            ns.print(new Date().toISOString() + " - " + "No one talked to us for " + forTime);
        }
    }
}
