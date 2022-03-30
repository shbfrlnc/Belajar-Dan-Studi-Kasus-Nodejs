# Belajar Node.js Nodemon
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

Kali ini, kita akan belajar penggunaan Nodemon di Node.js.

Nodemon digunakan dalam project Node.js yang bisa diinstall secara global atau sebagai devDependencies.

Tujuannya adalah agar jika ada script dalam project yang diubah, maka otomatis aplikasi Node.js akan di-restart.

## Contohnya

Di bawah ini, ada file package.json yang menunjukkan penggunaan Nodemon.

## Penjelasan

```
// file: package.json

{
  "name": "belajar-nodejs-nodemon",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
  	//Artinya ketika npm run dev diketikkan pada terminal di folder di mana package.json berada, maka nodemon akan menjalankan 		//dan mengawasi file berekstensi .js dan .html, serta folder bernama views dan file bernama app.js.
    "dev": "nodemon -e js,html -w views app.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  }
}
```

```
// file: app.js

// import module express
const express = require('express');

// inisialisasi express
const app = express();

// handle request "/"
app.get('/', (req, res, next) => {
    // tampilkan index.html
    res.sendFile(__dirname + '/views/' + 'index.html');
});

// jalankan server di port 3000
app.listen(3000, () => {
    console.log("Server berjalan di port 3000");
});
```

## Info Tambahan

Traktir Saya:

https://sociabuzz.com/lsfkrshb/tribe

Channel YouTube Saya:

https://www.youtube.com/c/shbfrlnc