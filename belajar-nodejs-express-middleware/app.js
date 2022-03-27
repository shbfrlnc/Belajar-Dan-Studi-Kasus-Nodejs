const express = require('express');
const app = express();

app.use((req, res, next) => {
    console.log('MIDDLEWARE 1');
    next();
});

app.get('/', (req, res) => {
    console.log('INDEX')
    res.send('INDEX');
});

app.get('/about', (req, res, next) => {
    console.log('MIDDLEWARE 2');
    next();
}, (req, res) => {
    console.log('ABOUT')
    res.send('ABOUT');
});

app.listen(3000, () => {
    console.log('Server berjalan di port 3000');
})