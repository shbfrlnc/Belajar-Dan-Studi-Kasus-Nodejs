# Studi Kasus Node.js Aplikasi Image Gallery

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

Kali ini kita akan belajar membuat aplikasi image gallery dengan Node.js.

Aplikasi yang akan kita buat ini nantinya bisa mengupload gambar dan menyimpannya dalam database.

Selain itu, image gallery ini juga bisa difilter dengan menggunakan tags.

Image yang sudah diupload akan masuk ke dalam listing image dan dapat dihapus dan didownload.

Dalam pembuatannya, aplikasi ini menggunakan multer untuk mengupload file dan menggunakan uuid untuk menggenerate nama yang unik untuk tiap file gambar yang diupload.

Aplikasi ini bekerja sebagaimana aplikasi CRUD pada umumnya.

## Contoh Kode

File app.js adalah script utama yang digunakan untuk memulai server. Di sana, multer juga dimulai agar nantinya kita bisa mengupload file.

File models/file.js adalah schema untuk file gambar yang akan kita upload.

File routes/index.js adalah route nya.

File views/index.ejs adalah view nya.

## Penjelasan

```
// file: models/file.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        required: false
    }],
    path: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("File", fileSchema);
```

```
// file: routes/index.js

// begin: import modules
const express = require('express');
const fs = require('fs');
const File = require('../models/file')
// end: import modules

// inisialisasi express
const router = express.Router();

// handle request "/"
router.get('/', async (req, res, next) => {
    // dapatkan file dari database.
    // jika ada query tag, maka gunakan hasil berdasarkan tag
    // jika tidak ambil semua file nya

    const allFiles = await File.find({});

    let resultTags = [];
    allFiles.forEach((item, index) => {
        item.tags.forEach((item1, index1) => {
            resultTags.push(item1)
        });
    });

    let uniqueTags = [...new Set(resultTags)];

    //
    const resultFiles = await File.find({
        tags: req.query.tag
    });

    res.render('index.ejs', {
        results: req.query.tag ? resultFiles : allFiles,
        resultTags: uniqueTags
    })
});

// handle request "/upload"
router.post('/upload', async (req, res, next) => {
    // jika request file ada
    if (req.file) {
        // simpan detailnya di database, di dalam model dengan schema File tadi
        const { title, tags } = req.body;
        const newFile = new File({
            title: title,
            tags: tags[1].split(","),
            path: req.file.path.replace("\\", "/")
        });

        // simpan
        await newFile.save();
    }
    // redirect ke homepage
    res.redirect('/');
});

// handle request "/delete/<id-nya>"
router.get('/delete/:id', async (req, res, next) => {
    // delete
    const deleted = await File.findOneAndDelete({
        _id: req.params.id
    });

    // hapus file nya
    fs.unlinkSync('./' + deleted.path);

    // redirect ke homepage
    res.redirect('/')
});

// handle request "/download/<id-nya>"
router.get('/download/:id', async (req, res, next) => {
    // cari file yang _id nya adalah <id-nya>
    const found = await File.findOne({
        _id: req.params.id
    });

    // jika ditemukan, maka download
    res.download(found.path);
});

module.exports = router;
```

```
<!-- file: views/index.ejs -->
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <link rel="shortcut icon" type="image/png" href="/public/favicon.png" />

    <title>
        Image Gallery
    </title>

    <link rel="stylesheet" href="/public/vendor/bootstrap/css/bootstrap.css" />
    <link rel="stylesheet" href="/public/vendor/bootstrap4-tagsinput/tagsinput.css">

    <style>
        body {
            margin-top: 80px;
            margin-bottom: 80px;
        }
    </style>
</head>

<body>
    <div id="app" class="container">
        <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-success">
            <a class="navbar-brand" href="/">
                Image Gallery
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item active">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                </ul>
            </div>
        </nav>
        <div class="row">
            <div class="col-12">
                <div class="jumbotron">
                    <h1>Selamat datang di Image Gallery</h1>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <button id="btn-upload-file" class="btn btn-success">Upload File (PNG, JPG, JPEG, GIF)</button>
                        <hr>
                        <% resultTags.forEach((item, index) =>{ %>
                            <a href="/?tag=<%= item %>"><span class="badge badge-pill badge-primary"><%= item %></span></a>
                        <% }); %>
                    </div>
                    <hr>
                    <div class="row">
                        <% results.forEach((item, index) => { %>
                        <div class="col-md-3 mb-3">
                            <div class="card">
                                <img src="/<%= item.path %>" class="card-img-top responsive-img" alt="...">
                                <hr>
                                <div class="card-body">
                                    <h5 class="card-text"><%= item.title %></h5>
                                </div>

                                <div class="card-footer">
                                    <a href="/download/<%= item._id %>"><span class="badge badge-pill badge-warning">Download</span></a>
                                    <a href="/delete/<%= item._id %>"><span class="badge badge-pill badge-danger">Delete</span></a>
                                </div>
                            </div>
                        </div>
                        <% }); %>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modal-add" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <form action="/upload" method="post" enctype="multipart/form-data">
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="title-add">Title</label>
                            <input type="text" class="form-control" id="title-add" name="title">
                        </div>
                        <div class="form-group">
                            <label for="tx-tags" class="col-md-4 control-label">Tags</label>
                            <input type="text" name="tags" value="" data-role="tagsinput" id="tx-tags" />
                        </div>
                        <div class="form-group">
                            <input id="fl-file" type="file" name="upload" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <footer class="footer">
        <nav class="navbar fixed-bottom navbar-expand-lg navbar-dark bg-success">
            <a class="navbar-brand" href="javascript:void(0);">Ini Adalah Footer</a>
        </nav>
    </footer>
    <script src="/public/vendor/jquery/jquery.js"></script>
    <script src="/public/vendor/bootstrap/js/bootstrap.bundle.js"></script>
    <script src="/public/vendor/bootstrap4-tagsinput/tagsinput.js"></script>
    <script>
        // tampilkan modal saat button dengan id btn-upload-file diklik
        $("#btn-upload-file").click(function () {
            $('#modal-add').modal({ backdrop: 'static', keyboard: false });
        });
    </script>
</body>

</html>
```

# 
