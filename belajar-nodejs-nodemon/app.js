const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/views/' + 'index.html');
});

app.listen(3000, () => {
    console.log("Server berjalan di port 3000");
});