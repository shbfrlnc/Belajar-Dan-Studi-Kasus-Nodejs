const machineId = require("node-machine-id").machineId;

async function dapatkanMachineID(original) {
    let mcid = await machineId({ original: original });
    return mcid;
}

async function run() {
    let mcid = await dapatkanMachineID(true);
    console.log(mcid);
}

run();
