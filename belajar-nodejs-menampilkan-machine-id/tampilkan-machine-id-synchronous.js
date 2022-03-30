const machineIdSync = require("node-machine-id").machineIdSync;

let mcid = machineIdSync({ original: true });
console.log(mcid);