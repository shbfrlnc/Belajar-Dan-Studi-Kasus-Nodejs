# Studi Kasus Node.js Aplikasi Login Multi Role
## Cara Mencoba Kode Ini

Untuk mencoba kode ini, download folder ini.

Selanjutnya, masuk ke dalam folder ini via terminal.

Selanjutnya, jalankan:

```
npm install
```

Selanjutnya, jalankan:

```
npm run dev
```

## Pendahuluan

Kali ini, kita akan belajar membuat aplikasi login yang mendukung banyak role dengan Node.js.

Aplikasi ini juga memperlihatkan penggunaan middleware sebagai cara untuk memfilter user.

## Cara Kerja

Aplikasi ini menggunakan sistem login pada umumnya.

Pertama-tama user harus register dahulu.

Untuk enkripsi password-nya digunakan bcrypt.

Setelah login, user dapat mengakses member area.

Di member route, dilakukan filtering terhadap user.

Proses filtering dilakukan dengan menggunakan middleware.

Middleware yang saya gunakan dirancang untuk bisa memfilter beberapa role.

## Penjelasan

```
// file: app.js

// begin: import modules
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const memberRouter = require('./routes/member');
// end: import modules

// inisialisasi express
const app = express();

// gunakan template engine EJS
app.set('view engine', 'ejs');

// gunakan body parser dari express
app.use(express.urlencoded({ extended: true }));

// gunakan cookie parser
app.use(cookieParser());

// buat middleware untuk session
app.use(session({
    secret: 'qweqweqweqwe',
    resave: false,
    saveUninitialized: false
}));

// jadikan folder public sebagai folder statis
app.use('/public', express.static(__dirname + '/public'));

// assign routes. parameter pertama adalah prefix path nya
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/member', memberRouter);

// jalankan server di port 3000
app.listen(3000, () => {
    mongoose.connect('mongodb://127.0.0.1:27017/myloginrole1');
    console.log('Server berjalan di port 3000.');
});
```

```
// file: routes/auth.js

// begin: import modules
const express = require('express');
const bcrypt = require('bcryptjs');
const sessionChecker = require('../middlewares/sessionchecker');
const User = require('../models/user');
// ends: import modules

// buat router nya
const router = express.Router();

// handle request get "/login"
// di sini digunakan middleware loggedInCheck yang bisa anda lihat di folder middlewares
router.get('/login', sessionChecker.loggedInCheck, async (req, res, next) => {
	// render login.ejs. isi datanya dengan roles
    res.render('login', {
        roles: User.schema.path('role').enumValues
    });
});

// handle request post "/login"
router.post('/login', async (req, res, next) => {
	// bongkar request body, jadi email, password, dan role
    const { email, password, role } = req.body;
	
	// cari user yang email dan role nya...
    const user = await User.findOne({
        email: email,
        role: role
    });

	// jika ada
    if (user) {
    	// jika emailnya...
        if (user.email == email) {
        	// test password
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

// handle request get "/register"
router.get('/register', async (req, res, next) => {
	// render register.ejs, isi datanya dengan roles
    res.render('register', {
        roles: User.schema.path('role').enumValues
    });
});

// handle request post "/register"
router.post('/register', async (req, res, next) => {
	// bongkar request body dan dapatkan datanya
    const { username, email, password, password_repeat, role } = req.body;

	// begin: cek ke-valid-an akun
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
    // end: cek ke-valid-an akun

	// buat user baru
    const newUser = new User({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 12),
        role: role
    })
    
    // simpan
    await newUser.save();

	// redirect ke login page
    res.redirect('/auth/login')
})

// handle request "/logout"
router.get("/logout", async (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect("/auth/login");
    });
});

module.exports = router;
```

```
// file: routes/index.js

// begin: halaman index sederhana
const express = require('express');

const router = express.Router();

router.get('/', async (req, res, next) => {
    res.render('index')
})
// end: halaman index sederhana

module.exports = router;
```

```
// file: routes/member.js

// import modul express
const express = require('express');

// import middleware
const sessionChecker = require('../middlewares/sessionchecker');

// buat routernya
const router = express.Router();

// menggunakan middleware tadi, dicek role nya. jika valid maka diteruskan.
// yang valid adalah Administrator, Member Level 1, dan Member Level 2
router.get(
    '/',
    sessionChecker.authCheck(['Administrator', 'Member Level 1', 'Member Level 2']),
    async (req, res, next) => {
        res.render('member', {
            username: req.session.user.username
        });
    }
);

// menggunakan middleware tadi, dicek role nya. jika valid maka diteruskan.
// yang valid adalah Administrator dan Member Level 1
router.get(
    '/for-member-level-1',
    sessionChecker.authCheck(['Administrator', 'Member Level 1']),
    async (req, res, next) => {
        res.render('member-level-1-only', {
            username: req.session.user.username
        });
    }
);

// menggunakan middleware tadi, dicek role nya. jika valid maka diteruskan.
// yang valid adalah Administrator dan Member Level 2
router.get(
    '/for-member-level-2',
    sessionChecker.authCheck(['Administrator', 'Member Level 2']),
    async (req, res, next) => {
        res.render('member-level-2-only', {
            username: req.session.user.username
        });
    }
);

module.exports = router;
```

```
// file: models/user.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            'Administrator',
            'Member Level 1',
            'Member Level 2'
        ],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
```

## Info Tambahan

Traktir Saya:

https://sociabuzz.com/lsfkrshb/tribe

Channel YouTube Saya:

https://www.youtube.com/c/shbfrlnc