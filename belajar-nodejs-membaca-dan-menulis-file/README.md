# Belajar Node.js Membaca dan Menulis File
## Pendahuluan

Kali ini kita akan belajar membaca dan menulis file di Node.js.

Pada dasarnya, untuk melakukan itu ada beberapa metode:

- Dengan cara asynchronous dan dengan callback.
- Dengan cara asynchronous dan async await.
- Dengan cara menggunakan versi synchronous dari API-nya.

## Contohnya

Di bawah ini ada 4 script. readfile.js dan readfilesync.js menunjukkan cara untuk membaca file, writefile.js dan writefilesync.js menunjukkan cara untuk menulist file.

Yang memiliki akhiran "sync" menggunakan metode synchronous, sedangkan yang tidak menggunakan metode asynchronous.

## Penjelasan

```
// file: readfile.js

// begin: import modules
const fs = require('fs');
const util = require('util');
// end: import modules

// baca file "hello.txt" secara asynchronous
function readHello() {
    fs.readFile('./hello.txt', 'utf8', function (err, data) {
    	// tampilkan isinya
        console.log(data);
    });
}

// baca file "hello.txt" secara asynchronous dengan async await
async function readHelloAsyncAwait() {
	// ubah dulu jadi promise
    const readFileAsyncAwait = util.promisify(fs.readFile);
    
    // sekarang baru bisa menggunakan async await
    const hello = await readFileAsyncAwait('./hello.txt', 'utf8');
    
    // tampilkan isinya
    console.log(hello);
}

// jalankan
readHello();
readHelloAsyncAwait();
```

```
// file: readfilesync.js

// import module fs
const fs = require('fs');

// baca file "hello.txt"
function readHello() {
	// baca secara synchronous. sudah tersedia fungsinya secara default
    const hello = fs.readFileSync('./hello.txt', 'utf8');
    
    // tampilkan isinya
    console.log(hello);
}

readHello();
```

```
// file: writefile.js

// begin: import modules
const fs = require('fs');
const util = require('util');
// end: import modules

// tulis file secara asyncrhonous
function writeHello() {
    fs.writeFile('./hello-write-file.txt', "hello world writeFile", function () {
        console.log('file sudah ditulis.');
    })
}

// tulis file secara asyncrhonous dengan async await
async function writeHelloAsyncAwait() {
	// ubah dulu jadi promise
    const writeFileAsyncAwait = util.promisify(fs.writeFile);
    
    // sekarang bisa menggunakan async await
    await writeFileAsyncAwait('./hello-write-file-async-await.txt', "hello world writeFileAsyncAwait");
    console.log('file sudah ditulis.');
}

// jalankan
// writeHello();

writeHelloAsyncAwait();
```

```
// file: writefilesync.js

// import module fs
const fs = require('fs');

// tulis file secara synchronous. fungsinya sudah tersedia secara default
function writeHello() {
    fs.writeFileSync('./hello-write-file-sync.txt', "hello world writeFileSync");
}

// jalankan
writeHello();
```



## Info Tambahan

Traktir Saya:

https://sociabuzz.com/lsfkrshb/tribe

Channel YouTube Saya:

https://www.youtube.com/c/SHBFRLNC
