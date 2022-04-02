# Belajar Node.js Express Router
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

Kali ini, kita akan belajar menggunakan Express Router di Node.js.

Agar routes dalam aplikasi yang menggunakan Express lebih rapi, maka digunakan Router.

## Sebagai Contoh

Di bawah ini, ada 3 script utama yang menggunakan router.

Script index.js dan about.js adalah script di mana response dan request terjadi.

Script app.js adalah script yang menggunakan kedua router tadi.

## Penjelasan

```
// file: app.js

// import module express
const express = require('express');

// inisialisasi express
const app = express();

// begin: import routes
const indexRouter = require('./routes/index.js');
const aboutRouter = require('./routes/about.js');
// end: import routes

// begin: gunakan sebagai routes. parameter pertama adalah path prefix nya
app.use('/', indexRouter);
app.use('/about', aboutRouter);
// end: gunakan sebagai routes. parameter pertama adalah path prefix nya

// jalankan server di port 3000
app.listen(3000, () => {
    console.log('Server berjalan di port 3000');
})
```

```
// file: routes/index.js

// import express
const express = require('express');

// buat routernya
const router = express.Router();

// handle request "/"
router.get('/', (req, res) => {
	// kirim teks bertuliskan "INDEX"
    res.send("INDEX");
});

// export modul ini
module.exports = router;
```

```
// file: routes/about.js

// import express
const express = require('express');

// buat router dari express
const router = express.Router();

// handle request /about. perhatikan di app.js, saat mengimpor routes
router.get('/', (req, res) => {
    res.send("ABOUT");
});

// export module ini
module.exports = router;
```

## Info Tambahan

Traktir Saya:

https://sociabuzz.com/lsfkrshb/tribe

Channel YouTube Saya:

https://www.youtube.com/c/SHBFRLNC
