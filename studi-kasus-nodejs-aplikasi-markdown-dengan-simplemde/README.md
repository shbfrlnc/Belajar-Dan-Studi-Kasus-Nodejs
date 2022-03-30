# Studi Kasus Node.js Aplikasi Markdown dengan SimpleMDE
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

Kali ini, kita akan belajar membuat aplikasi CRUD Markdown dengan SimpleMDE dan beberapa modul Node.js.

Aplikasi yang akan kita buat ini nantinya bisa membuat, membaca, mengupdate, dan menghapus artikel dengan format markdown.

Artikel tersebut juga bisa disisipi gambar yang diambil dari image gallery.

Jadi ada dua bagian di aplikasi ini:

- Artikel
- Image Gallery

Nantinya jika kita ingin menyisipi gambar di artikel, kita tinggal mengklik icon tertentu sehingga pop up berisi daftar gambar memunculkan gambar-gambar dari gallery.

Adapun gallery digunakan untuk me-manage gambar yang diupload.

## Cara Kerja

Aplikasi ini bekerja sebagaimana aplikasi CRUD pada umumnya.

Walaupun begitu, ada sedikit penambahan fitur pada aplikasi ini.

Misalnya, format yang digunakan untuk create dan update adalah markdown.

Selain itu, saya juga memberi tambahan fitur pada editor markdownnya untuk menyisipkan gambar dari gallery.

Fitur tersebut bekerja di sisi client maupun server.

Pada saat kita mengklik icon di toolbarnya, kita me-request ke server melalui AJAX untuk mem-fetch gambar yang tersedia di gallery. Perhatikan script di bawah ini pada baris 34 sampai 41 dan 53 sampai 56.

## Struktur Project

Project aplikasi ini terdiri dari folder models, public, routes, dan views.

Folder models menyimpan script-script yang merupakan model database dari aplikasi ini.

Folder public menyimpan asset CSS dan JS.

Folder routes menyimpan script untuk routes aplikasi ini.

Folder views menyimpan script untuk tampilan dari aplikasi ini.

## Penjelasan

Sehubungan dengan banyaknya script yang ada dalam project ini, maka saya akan bahas yang penting saja.

Pertama, script app.js:

```
// file: app.js

// begin: import modules
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const indexRouter = require('./routes/index');
const galleryRouter = require('./routes/gallery')
// end: import modules

// inisialisasi express
const app = express();

// gunakan template engine EJS
app.set('view engine', 'ejs');

// body parser express urlencoded
app.use(express.urlencoded({ extended: false }));

// cara mengupload dengan multer. hanya file gambar saja yang diizinkan.
// setiap file disimpan dengan kode unik dari uuid v4
app.use(multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, './uploads');
        },
        filename: (req, file, callback) => {
            callback(null, uuidv4() + "-" + file.originalname);
        }
    }),
    fileFilter: (req, file, callback) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/gif') {
            callback(null, true);
        } else {
            callback(null, false);
        }
    }
}).single('upload'));

// folder publid dan uploads dijadikan folder statis
app.use('/public', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

// gunakan router-router ini.
app.use('/', indexRouter);
app.use('/gallery', galleryRouter);

// koneksi ke mongodb. jika berhasil, baru kemudian server dijalankan di port 3000
mongoose.connect('mongodb://127.0.0.1:27017/studi-kasus-nodejs-aplikasi-markdown-dengan-simplemde');
mongoose.connection.on("connected", function () {
    app.listen(3000, function () {
        console.log('server berjalan di port 3000');
    })
});
```

```
// file: routes/index.js

const express = require('express');
const showdown = require('showdown');
const excerptHtml = require('excerpt-html');
const Article = require('../models/article');

const router = express.Router();
const converter = new showdown.Converter();

router.get('/', async (req, res, next) => {
    const articles = await Article.find({});

    let finalArticles = articles.map((item) => {
    	// gunakan modul excerptHtml untuk menggenerate excerpt
        item.excerpt = excerptHtml(converter.makeHtml(item.content));
        return item;
    });

    res.render('layout.ejs', {
        child: 'index.ejs',
        clientScript: 'index.js.ejs',
        data: {
            results: finalArticles
        }
    });
});

router.get('/add', async (req, res, next) => {
    res.render('layout.ejs', {
        child: 'add.ejs',
        clientScript: 'add.js.ejs',
        data: null
    });
});

router.post('/add', async (req, res, next) => {
    const { title, content } = req.body;

    let articles = new Article({
        title: title,
        content: content
    });

    await articles.save();

    res.redirect('/');
});

router.get('/edit/:id', async (req, res, next) => {
    const article = await Article.findOne({
        _id: req.params.id
    });

    res.render('layout.ejs', {
        child: 'edit.ejs',
        clientScript: 'edit.js.ejs',
        data: {
            result: article
        }
    });
});

router.post('/edit', async (req, res, next) => {
    const { id, title, content } = req.body;

    await Article.updateOne({
        _id: id
    }, {
        $set: {
            title: title,
            content: content
        }
    })

    res.redirect('/');
});

router.get('/show/:id', async (req, res, next) => {
    const article = await Article.findOne({
        _id: req.params.id
    });

    res.render('layout.ejs', {
        child: 'show.ejs',
        clientScript: 'show.js.ejs',
        data: {
            resultTitle: article.title,
            resultContent: converter.makeHtml(article.content)
        }
    });
});

router.get('/delete/:id', async (req, res, next) => {

    await Article.deleteOne({
        _id: req.params.id
    });

    res.redirect('/');
});

module.exports = router;
```

Yang perlu Anda perhatikan adalah parameter fungsi render pada beberapa handler:

```
// misal:
res.render('layout.ejs', {
	child: 'edit.ejs',
	clientScript: 'edit.js.ejs',
	data: {
		result: article
	}
});
```

edit.js.ejs sebenarnya dimasukkan via tag ejs ini di bagian layout.ejs:

```
 <%- include(clientScript, {data: data}); %>
```

Tujuannya adalah agar jika ada dependency JavaScript yang diletakkan di bawah, maka client script tadi dijalankan setelahnya.

Maka itulah data berada di child. Bukan di root.

Adapun script ini:

```
// file: routes/gallery.js

const express = require('express');
const fs = require('fs');
const File = require('../models/file');

const router = express.Router();

router.get('/', async (req, res, next) => {
    //
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

    res.render('layout.ejs', {
        child: 'gallery.ejs',
        clientScript: 'gallery.js.ejs',
        data: {
            results: req.query.tag ? resultFiles : allFiles,
            resultTags: uniqueTags
        }
    });
});

router.get('/ajax-list-image', async (req, res, next) => {
    const allFiles = await File.find({});
    res.json(allFiles)
});

router.post('/upload', async (req, res, next) => {
    if (req.file) {
        const { title, tags } = req.body;
        const newFile = new File({
            title: title,
            tags: tags[1].split(","),
            path: req.file.path.replace("\\", "/")
        });

        await newFile.save();
    }
    res.redirect('/gallery');
});

router.get('/delete/:id', async (req, res, next) => {
    const deleted = await File.findOneAndDelete({
        _id: req.params.id
    });

    fs.unlinkSync('./' + deleted.path);

    res.redirect('/gallery')
});

router.get('/download/:id', async (req, res, next) => {
    const found = await File.findOne({
        _id: req.params.id
    });

    res.download(found.path);
});

module.exports = router;
```

Tujuannya adalah untuk mengatur file yang diupload.

Dan ada satu hal lagi.

Pada views/add.js.ejs dan views/edit.js.ejs ada script semacam ini:

```
<script>
    let imagePath;
    let codeMirror;
    const simplemde = new SimpleMDE({
        element: $("#" + "txa-article-content")[0],
        toolbar: [
            "bold",
            "italic",
            "heading",
            "strikethrough",
            "|",
            "quote",
            "unordered-list",
            "ordered-list",
            "|",
            "link",
            "table",
            "image",
            "|",
            "preview",
            "|",
            {
                name: "image-upload",
                action: function customFunction(editor) {
                    $('#modal-get-image').modal({ backdrop: 'static', keyboard: false });
                    codeMirror = editor.codemirror;
                },
                className: "fa fa-file",
                title: "Image Upload",
            }
        ]
    });

    $('#modal-get-image').on('shown.bs.modal', async function () {
        const results = await getImageList('/gallery/ajax-list-image');
        results.forEach((item, index) => {
            $('#my-modal-body').append(`
            <div class="col-md-6 mb-2"><img data-path="${item.path}" src="/${item.path}" class="card-img-top responsive-img" alt="..."></div>
            `)
        });
    });

    $(document).on('dblclick', '#my-modal-body div img', function () {
        imagePath = $(this).data('path');
        const url = "/" + imagePath;
        const currentCursorPos = codeMirror.getCursor();
        codeMirror.replaceSelection(`![](${url})`);
        $('#modal-get-image').modal('hide');
        codeMirror.focus();
        codeMirror.setCursor({ line: currentCursorPos.line, ch: currentCursorPos.ch + 2 });
    });

    async function getImageList(url) {
        const results = await fetch(url);
        return results.json();
    }
</script>
```

Script itulah yang tugasnya untuk merequest AJAX untuk memilih gambar.

## Info Tambahan

Traktir Saya:

https://sociabuzz.com/lsfkrshb/tribe

Channel YouTube Saya:

https://www.youtube.com/c/shbfrlnc