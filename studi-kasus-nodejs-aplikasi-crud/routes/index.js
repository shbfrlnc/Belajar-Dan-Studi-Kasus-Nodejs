const express = require('express');
const ToDo = require('../models/todo');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const todos = await ToDo.find({});

    res.render('index', {
        results: todos
    })
});

router.post('/add', async (req, res, next) => {
    const { title, description } = req.body;

    let todo = new ToDo({
        title: title,
        description: description
    });

    await todo.save();

    res.redirect('/');
});

router.post('/edit', async (req, res, next) => {
    const { id, title, description } = req.body;

    await ToDo.updateOne({
        _id: id
    }, {
        $set: {
            title: title,
            description: description
        }
    })

    res.redirect('/');
});

router.get('/delete/:id', async (req, res, next) => {

    await ToDo.deleteOne({
        _id: req.params.id
    });

    res.redirect('/');
});

module.exports = router;