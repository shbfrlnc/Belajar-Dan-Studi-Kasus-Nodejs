const express = require('express');
const app = express();

const indexRouter = require('./routes/index.js');
const aboutRouter = require('./routes/about.js');

app.use('/', indexRouter);
app.use('/about', aboutRouter);

app.listen(3000, () => {
    console.log('Server berjalan di port 3000');
})