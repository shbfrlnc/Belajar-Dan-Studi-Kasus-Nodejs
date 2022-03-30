# Belajar Node.js Hello World Tanpa Framework
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

Walaupun sebenarnya aplikasi hello world bisa dibuat dengan menggunakan Express, ada baiknya juga jika kita tahu caranya tanpa menggunakan framework apapun.

## Penjelasan

```
// file: app.js

// import module http
const http = require('http');

// buat server. dan apapun request nya...
const server = http.createServer((req, res) => {
	// response dengan teks hello world. kemudian akhiri
    res.write("Hello World!");
    res.end();
});

// jalankan server di port 3000
server.listen(3000, () => {
    console.log("Server berjalan di port 3000.");
})
```

## Info Tambahan

Traktir Saya:

https://sociabuzz.com/lsfkrshb/tribe

Channel YouTube Saya:

https://www.youtube.com/c/shbfrlnc