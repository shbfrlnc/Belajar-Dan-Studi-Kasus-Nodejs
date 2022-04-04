# Belajar Node.js Hello World dengan Express

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

Kita bisa membuat aplikasi hello world dengan lebih mudah menggunakan Express.

## Penjelasan

```
// file: app.js

// import module express
const express = require('express');

// inisialisasi express
const server = express();

// handle request "/"
server.get('/', (req, res, next) => {
    // response dengan teks "Hello World!", kemudian akhiri
    res.write("Hello World!");
    res.end();
});

// jalankan server di port 3000
server.listen(3000, () => {
    console.log("Server berjalan di port 3000.");
});
```

# 
