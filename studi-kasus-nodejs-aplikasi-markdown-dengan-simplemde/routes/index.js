const express = require('express');
const showdown = require('showdown');
const excerptHtml = require('excerpt-html');
const Article = require('../models/article');

const router = express.Router();
const converter = new showdown.Converter();

router.get('/', async (req, res, next) => {
    const articles = await Article.find({});

    let finalArticles = articles.map((item) => {
        item.excerpt = excerptHtml(converter.makeHtml(item.content));
        return item;
    });

    res.render('layout.ejs', {
        child: 'index.ejs',
        clientScript: 'index.js.ejs',
        data: {
            results: finalArticles
        }
    });
});

router.get('/add', async (req, res, next) => {
    res.render('layout.ejs', {
        child: 'add.ejs',
        clientScript: 'add.js.ejs',
        data: null
    });
});

router.post('/add', async (req, res, next) => {
    const { title, content } = req.body;

    let articles = new Article({
        title: title,
        content: content
    });

    await articles.save();

    res.redirect('/');
});

router.get('/edit/:id', async (req, res, next) => {
    const article = await Article.findOne({
        _id: req.params.id
    });

    res.render('layout.ejs', {
        child: 'edit.ejs',
        clientScript: 'edit.js.ejs',
        data: {
            result: article
        }
    });
});

router.post('/edit', async (req, res, next) => {
    const { id, title, content } = req.body;

    await Article.updateOne({
        _id: id
    }, {
        $set: {
            title: title,
            content: content
        }
    })

    res.redirect('/');
});

router.get('/show/:id', async (req, res, next) => {
    const article = await Article.findOne({
        _id: req.params.id
    });

    res.render('layout.ejs', {
        child: 'show.ejs',
        clientScript: 'show.js.ejs',
        data: {
            resultTitle: article.title,
            resultContent: converter.makeHtml(article.content)
        }
    });
});

router.get('/delete/:id', async (req, res, next) => {

    await Article.deleteOne({
        _id: req.params.id
    });

    res.redirect('/');
});

module.exports = router;