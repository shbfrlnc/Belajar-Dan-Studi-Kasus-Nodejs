# Belajar Node.js Menampilkan Machine ID

## Pendahuluan

Ketika kita membuat sebuah aplikasi, terutama aplikasi desktop, mungkin saja kita ingin membatasi penginstallan aplikasi tersebut pada satu komputer saja.

Dengan kata lain kita mungkin menginginkan sebuah sistem lisensi dalam aplikasi kita.

Agar hal tersebut dapat terwujud diperlukan suatu cara untuk mendapatkan identitas unik dari OS di komputer tersebut.

Node Machine ID ( https://www.npmjs.com/package/node-machine-id ) bisa membantu kita untuk mendapatkan unique id dari OS yang menggunakannya.

## Cara Kerja

Pada dasarnya Node Machine ID menggunakan registry untuk mendapatkan unique id di Windows.

Tepatnya di "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Cryptography".

## Penjelasan

```
// file: tampilkan-machine-id-asynchronous.js

// import modul node-machine-id
const machineId = require("node-machine-id").machineId;

// ambil machine id nya
async function dapatkanMachineID(original) {
    let mcid = await machineId({ original: original });
    return mcid;
}

// bungkus dalam sebuah function
async function run() {
    let mcid = await dapatkanMachineID(true);
    console.log(mcid);
}

// jalankan
run();
```

```
// file: tampilkan-machine-id-synchronous.js

// import modul node-machine-id
const machineIdSync = require("node-machine-id").machineIdSync;

// ambil machine id nya
let mcid = machineIdSync({ original: true });
console.log(mcid);
```

# 
