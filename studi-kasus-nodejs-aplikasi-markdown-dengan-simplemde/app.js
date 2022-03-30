const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const indexRouter = require('./routes/index');
const galleryRouter = require('./routes/gallery')

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, './uploads');
        },
        filename: (req, file, callback) => {
            callback(null, uuidv4() + "-" + file.originalname);
        }
    }),
    fileFilter: (req, file, callback) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/gif') {
            callback(null, true);
        } else {
            callback(null, false);
        }
    }
}).single('upload'));

app.use('/public', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use('/', indexRouter);
app.use('/gallery', galleryRouter);

mongoose.connect('mongodb://127.0.0.1:27017/studi-kasus-nodejs-aplikasi-markdown-dengan-simplemde');
mongoose.connection.on("connected", function () {
    app.listen(3000, function () {
        console.log('server berjalan di port 3000');
    })
});