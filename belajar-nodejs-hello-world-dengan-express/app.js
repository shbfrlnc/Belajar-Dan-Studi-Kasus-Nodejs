const express = require('express');
const server = express();

server.get('/', (req, res, next) => {
    res.write("Hello World!");
    res.end();
});

server.listen(3000, () => {
    console.log("Server berjalan di port 3000.");
});