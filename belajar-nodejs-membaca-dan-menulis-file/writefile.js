const fs = require('fs');
const util = require('util');

function writeHello() {
    fs.writeFile('./hello-write-file.txt', "hello world writeFile", function () {
        console.log('file sudah ditulis.');
    })
}

async function writeHelloAsyncAwait() {
    const writeFileAsyncAwait = util.promisify(fs.writeFile);
    await writeFileAsyncAwait('./hello-write-file-async-await.txt', "hello world writeFileAsyncAwait");
    console.log('file sudah ditulis.');
}

// writeHello();

writeHelloAsyncAwait();