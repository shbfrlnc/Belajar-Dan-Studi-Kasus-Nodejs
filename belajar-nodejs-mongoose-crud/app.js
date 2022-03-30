const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

app.use(express.json());

app.get('/', async (req, res, next) => {
    // Dapatkan semua user
    const user = await User.find({});
    res.json(user);
});

app.get('/skip', async (req, res, next) => {
    // Dapatkan semua user, tapi skip 5 document
    const user = await User
        .find({})
        .skip(5)
    res.json(user);
});

app.get('/limit', async (req, res, next) => {
    // Dapatkan semua user, tapi batasi 5 document saja
    const user = await User
        .find({})
        .limit(5)
    res.json(user);
});

app.get('/sort-ascending', async (req, res, next) => {
    // Dapatkan semua user, tapi sort string_1 secara ascending
    const user = await User
        .find({})
        .sort({ string_1: 1 })
    res.json(user);
});

app.get('/sort-descending', async (req, res, next) => {
    // Dapatkan semua user, tapi sort string_1 secara desscending
    const user = await User
        .find({})
        .sort({ string_1: -1 })
    res.json(user);
});

app.get('/select', async (req, res, next) => {
    // Dapatkan field string_1 dan number_1 dari user
    const user = await User
        .find({})
        .select({ string_1: 1, number_1: 1 })
    res.json(user);
});

app.get('/gte-lte', async (req, res, next) => {
    // Dapatkan user yang number_1 nya lebih besar atau sama dengan 30 dan lebih kecil dari atau sama dengan 50
    const user = await User
        .find({
            number_1: {
                $gte: 30,
                $lte: 50
            }
        });
    res.json(user);
});

app.get('/in', async (req, res, next) => {
    // Dapatkan user yang number_1 nya 30 dan 50
    const user = await User
        .find({
            number_1: {
                $in: [30, 50]
            }
        });
    res.json(user);
});

app.get('/and', async (req, res, next) => {
    // Dapatkan user yang string_1 nya "swlrnshw-200-40" dan number_1 nya 40
    const user = await User
        .find({})
        .and([{ string_1: "swlrnshw-200-40" }, { number_1: 40 }]);
    res.json(user);
});

app.get('/or', async (req, res, next) => {
    // Dapatkan user yang string_1 nya "swlrnshw-200-40" atau number_1 nya 40
    const user = await User
        .find({})
        .or([{ string_1: "swlrnshw-200-40" }, { number_1: 60 }]);
    res.json(user);
});

app.get('/regex', async (req, res, next) => {
    // Dapatkan user yang string_1 nya match dengan regex ini
    const user = await User
        .find({
            string_1: /200-33$/
        });
    res.json(user);
});

app.get('/count', async (req, res, next) => {
    // Dapatkan jumlah semua user
    const userCount = await User
        .find({})
        .count();
    res.json({
        count: userCount
    });
});

app.post('/insert', async (req, res, next) => {
    // Cara meng insert user
    let user = new User(req.body);
    await user.save();
    res.json(user);
});

app.put('/update-query-first', async (req, res, next) => {
    // Cara meng update user
    const user = await User.findOne({
        string_1: /200-33$/
    });

    user.string_1 = "SWLRNSHW-200 33"
    const result = await user.save();
    res.json(result);
});

app.put('/update-update-first', async (req, res, next) => {
    // Cara meng update user
    const user = await User.findOneAndUpdate({
        string_1: /200-34$/
    }, {
        $set: {
            string_1: "SWLRNSHW-200 34"
        }
    }, {
        new: true
    });
    res.json(user);
});

app.delete('/delete', async (req, res, next) => {
    // Cara meng hapus user
    const user = await User.findOneAndDelete({
        string_1: "swlrnshw-200-80"
    });
    res.json(user);
});

let port = 3000;
app.listen(port, async () => {
    mongoose.connect('mongodb://127.0.0.1:27017/belajar-nodejs-mongoose');
    const user = await User.find({});
    if (user.length == 0) {
        console.log('Database masih kosong. Seeding...')
        for (let i = 0; i < 100; ++i) {
            let newUser = new User({
                string_1: "swlrnshw-200-" + i.toString(),
                number_1: i,
                boolean_1: i % 2 == 0 ? true : false,
                enum_1: User.schema.path('enum_1').enumValues[Math.floor(Math.random() * User.schema.path('enum_1').enumValues.length)]
            })

            await newUser.save();
        }
    }
    console.log(`Server berjalan di port ${port}`)
})