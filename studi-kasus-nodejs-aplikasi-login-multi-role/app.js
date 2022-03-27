const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const memberRouter = require('./routes/member');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'qweqweqweqwe',
    resave: false,
    saveUninitialized: false
}));

app.use('/public', express.static(__dirname + '/public'));
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/member', memberRouter);

app.listen(3000, () => {
    mongoose.connect('mongodb://127.0.0.1:27017/myloginrole1');
    console.log('Server berjalan di port 3000.');
});