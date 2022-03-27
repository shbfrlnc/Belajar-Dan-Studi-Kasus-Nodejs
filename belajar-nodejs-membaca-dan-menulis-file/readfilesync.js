const fs = require('fs');

function readHello() {
    const hello = fs.readFileSync('./hello.txt', 'utf8');
    console.log(hello);
}

readHello();