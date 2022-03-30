const express = require('express');
const bcrypt = require('bcryptjs');
const sessionChecker = require('../middlewares/sessionchecker');
const User = require('../models/user');

const router = express.Router();

router.get('/login', sessionChecker.loggedInCheck, async (req, res, next) => {
    res.render('login', {
        roles: User.schema.path('role').enumValues
    });
});

router.post('/login', async (req, res, next) => {
    const { email, password, role } = req.body;

    const user = await User.findOne({
        email: email,
        role: role
    });

    if (user) {
        if (user.email == email) {
            if (bcrypt.compareSync(password, user.password) == true) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                res.redirect("/member");
            } else {
                console.log("Password tidak match.");
                res.redirect("/auth/login");
            }
        } else {
            console.log("Email tidak match.");
            res.redirect('/auth/login');
        }
    } else {
        console.log("User tidak ditemukan.");
        res.redirect('/auth/login');
    }
});

router.get('/register', async (req, res, next) => {
    res.render('register', {
        roles: User.schema.path('role').enumValues
    });
});

router.post('/register', async (req, res, next) => {
    const { username, email, password, password_repeat, role } = req.body;

    const testUsername = await User.findOne({
        username: username
    });

    const testEmail = await User.findOne({
        email: email
    });

    const testAdmin = await User.findOne({
        role: 'Administrator'
    });

    if (testAdmin && role == 'Administrator') {
        console.log("Admin sudah didaftarkan. Tidak bisa lagi.");
        res.redirect('/auth/register');
        return;
    }

    if (testUsername || testEmail) {
        console.log("username atau email sudah ada.");
        res.redirect('/auth/register');
        return;
    }

    if (password != password_repeat) {
        console.log("password tidak match.");
        res.redirect('/auth/register');
        return;
    }

    if (User.schema.path('role').enumValues.includes(role) == false) {
        console.log("role tidak terdefinisi.");
        res.redirect('/auth/register');
        return;
    }

    const newUser = new User({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 12),
        role: role
    })
    await newUser.save();

    res.redirect('/auth/login')
})

router.get("/logout", async (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect("/auth/login");
    });
});

module.exports = router;