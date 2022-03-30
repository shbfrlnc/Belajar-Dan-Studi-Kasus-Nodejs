const express = require('express');
const fs = require('fs');
const File = require('../models/file');

const router = express.Router();

router.get('/', async (req, res, next) => {
    //
    const allFiles = await File.find({});

    let resultTags = [];
    allFiles.forEach((item, index) => {
        item.tags.forEach((item1, index1) => {
            resultTags.push(item1)
        });
    });

    let uniqueTags = [...new Set(resultTags)];

    //
    const resultFiles = await File.find({
        tags: req.query.tag
    });

    res.render('layout.ejs', {
        child: 'gallery.ejs',
        clientScript: 'gallery.js.ejs',
        data: {
            results: req.query.tag ? resultFiles : allFiles,
            resultTags: uniqueTags
        }
    });
});

router.get('/ajax-list-image', async (req, res, next) => {
    const allFiles = await File.find({});
    res.json(allFiles)
});

router.post('/upload', async (req, res, next) => {
    if (req.file) {
        const { title, tags } = req.body;
        const newFile = new File({
            title: title,
            tags: tags[1].split(","),
            path: req.file.path.replace("\\", "/")
        });

        await newFile.save();
    }
    res.redirect('/gallery');
});

router.get('/delete/:id', async (req, res, next) => {
    const deleted = await File.findOneAndDelete({
        _id: req.params.id
    });

    fs.unlinkSync('./' + deleted.path);

    res.redirect('/gallery')
});

router.get('/download/:id', async (req, res, next) => {
    const found = await File.findOne({
        _id: req.params.id
    });

    res.download(found.path);
});

module.exports = router;