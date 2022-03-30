# Studi Kasus Node.js Aplikasi CRUD
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

Kali ini, kita akan belajar membuat aplikasi CRUD sederhana dengan Node.js.

DBMS yang digunakan adalah MongoDB dengan Mongoose.

Cara kerja aplikasi ini adalah seperti aplikasi CRUD pada umumnya, yakni melakukan create, read, update, dan delete.

## Contoh Kode

File app.js adalah script utama yang digunakan untuk memulai server.

File routes/index.js adalah route nya.

File views/index.ejs adalah view nya.

## Penjelasan

```
// file: app.js

// begin: import modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
// end: import modules

// inisialisasi express
const app = express();

// gunakan template engine EJS
app.set('view engine', 'ejs');

// jadikan folder public sebagai folder statis
app.use('/public', express.static(__dirname + '/public'));

// gunakan bodyparser
app.use(bodyParser.urlencoded());

// jadikan indexRouter middleware
app.use('/', indexRouter);

// jalankan server di port 3000
app.listen(3000, () => {
    mongoose.connect('mongodb://127.0.0.1:27017/mycrud1');
    console.log("Server berjalan di port 3000");
});
```

```
// file: routes/index.js

// import module express
const express = require('express');

// import model todo
const ToDo = require('../models/todo');

// buat router nya
const router = express.Router();

// handle request "/"
router.get('/', async (req, res, next) => {
	// dengan async await, list semua todo
    const todos = await ToDo.find({});

	// masukkan data todos ke view yang bernama index.ejs
    res.render('index', {
        results: todos
    })
});

// handle request "/add"
router.post('/add', async (req, res, next) => {
	// bongkar request body menjadi title dan description. ini sesuai dengan value dari attribute name di ejs.
    const { title, description } = req.body;

	// buat todo baru dengan data barusan
    let todo = new ToDo({
        title: title,
        description: description
    });

	// simpan ke database
    await todo.save();

	// redirect ke home
    res.redirect('/');
});

// handle request  "/edit"
router.post('/edit', async (req, res, next) => {
	// bongkar request body menjadi id, title, dan description. ini sesuai dengan value dari attribute name di ejs.
    const { id, title, description } = req.body;

	// update where _id = id set title dan desciption dengan data barusan
    await ToDo.updateOne({
        _id: id
    }, {
        $set: {
            title: title,
            description: description
        }
    })

	// redirect ke homepage
    res.redirect('/');
});

// handle request "/delete/<id-nya>"
router.get('/delete/:id', async (req, res, next) => {

	// delete where _id = req.params.id yang dilewatkan dari :id
    await ToDo.deleteOne({
        _id: req.params.id
    });

	// redirect ke homepage
    res.redirect('/');
});

module.exports = router;
```

```
<!-- file: views/index.ejs -->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/public/vendor/bootstrap/css/bootstrap.css">

    <style>

    </style>
    <title>Node.js CRUD App (To Do)</title>
</head>

<body>
    <nav class="navbar navbar-dark bg-dark">
        <span class="navbar-brand mb-0 h1">Node.js CRUD App (To Do)</span>
    </nav>

    <div class="container">
        <div class="row">
            <div class="col-12">
                <div class="mt-3"></div>
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-add">
                    Add To Do
                </button>

                <div class="card">
                    <div class="card-body">
                        <h2>List Of To Do</h2>

                        <div class="list-group">
                            <% results.forEach((item, index) => { %>
                            <div href="#" class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1"><%= item.title %></h5>
                                </div>
                                <p class="mb-1"><%= item.description %></p>
                                <a 
                                class="btn-edit-modal"
                                data-toggle="modal" 
                                data-target="#modal-edit"
                                data-id="<%= item._id %>"
                                data-title="<%= item.title %>"
                                data-description="<%= item.description %>"
                                >
                                    <span class="badge badge-pill badge-success">edit</span>
                                </a>
                                <a 
                                href="/delete/<%= item.id %>"
                                >
                                    <span class="badge badge-pill badge-danger">delete</span>
                                </a>
                            </div>
                            <% }); %>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- Add Modal -->
    <div class="modal fade" id="modal-add" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form action="/add" method="POST">
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="title-add">Title</label>
                            <input type="text" class="form-control" id="title-add" name="title">
                        </div>
                        <div class="form-group">
                            <label for="description-add">Description</label>
                            <input type="text" class="form-control" id="description-add" name="description">
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

    <!-- Edit Modal -->
    <div class="modal fade" id="modal-edit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form action="/edit" method="POST">
                    <div class="modal-body">
                        <input id="id-edit" type="hidden" name="id" value="">
                        <div class="form-group">
                            <label for="title-edit">Title</label>
                            <input type="text" class="form-control" id="title-edit" name="title" value="">
                        </div>
                        <div class="form-group">
                            <label for="description-edit">Description</label>
                            <input type="text" class="form-control" id="description-edit" name="description" value="">
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
    <script src="/public/vendor/jquery/jquery.js"></script>
    <script src="/public/vendor/bootstrap/js/bootstrap.bundle.js"></script>
    <script>
    	// ketika elemen dengan class btn-edit-modal diklik
        $(document).on('click', '.btn-edit-modal', function () {
        	// ambil datanya: id, title, description, yang tadinya ada di data- attribute
            $("#id-edit").val($(this).data('id'));
            $("#title-edit").val($(this).data('title'));
            $("#description-edit").val($(this).data('description'));
        });
    </script>
</body>

</html>
```

## Info Tambahan

Traktir Saya:

https://sociabuzz.com/lsfkrshb/tribe

Channel YouTube Saya:

https://www.youtube.com/c/shbfrlnc