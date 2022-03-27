const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');

const app = express();

app.set('view engine', 'ejs');

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());
app.use('/', indexRouter);

app.listen(3000, () => {
    mongoose.connect('mongodb://127.0.0.1:27017/mycrud1');
    console.log("Server berjalan di port 3000");
});