# Belajar Node.js Express Middleware
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

Kali ini, kita akan belajar menggunakan middleware untuk Node.js Express.

Middleware memiliki banyak kegunaan. Salah satunya adalah untuk memfilter user yang sudah login.

## Penjelasan

```
// begin: import modules
const express = require('express');
const app = express();
// end: import modules

// middleware ini berjalan secara global
app.use((req, res, next) => {
    console.log('MIDDLEWARE 1');
    next();
});

// request get untuk "/" atau dengan kata lain halaman index
app.get('/', (req, res) => {
    console.log('INDEX')
    res.send('INDEX');
});

// middleware ini berjalan secara lokal.
// perhatikan bahwa parameter ke-2 diisi function. itu middleware nya
app.get('/about', (req, res, next) => {
    console.log('MIDDLEWARE 2');
    next();
}, (req, res) => {
    console.log('ABOUT')
    res.send('ABOUT');
});

// jalankan server di port 3000
app.listen(3000, () => {
    console.log('Server berjalan di port 3000');
})
```

## Info Tambahan

Traktir Saya:

https://sociabuzz.com/lsfkrshb/tribe

Channel YouTube Saya:

https://www.youtube.com/c/shbfrlnc