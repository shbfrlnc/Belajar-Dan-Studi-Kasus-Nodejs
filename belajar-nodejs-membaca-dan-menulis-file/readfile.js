const fs = require('fs');
const util = require('util');

function readHello() {
    fs.readFile('./hello.txt', 'utf8', function (err, data) {
        console.log(data);
    });
}

async function readHelloAsyncAwait() {
    const readFileAsyncAwait = util.promisify(fs.readFile);
    const hello = await readFileAsyncAwait('./hello.txt', 'utf8');
    console.log(hello);
}

readHello();
readHelloAsyncAwait();