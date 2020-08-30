const express = require('express');
const bp = require('body-parser');
const sqlite = require('sqlite3');

const db = new sqlite.Database(__dirname + './db.sqlite', (err) => {
    if (err) throw err;
});

db.serialize(() => {
    const sql = `
        Create Table If Not Exists kontak(
            id integer primary key autoincrement,
            nama varchar (50) not null,
            nohp varchar(20) not null
        )
    `;
    db.run(sql, (err) => {
        if (err) throw err;
    });
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bp.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    //Menampilkan List
    //console.log(res.render);
    db.serialize(() => {
        const sql = 'select * from kontak';
        db.all(sql, (err, rows) => {
            if (err) throw err;
            res.render('index.ejs', { kontak: rows });
        });
    });
});

app.get('/:id', (req, res) => {
    //Tampil Data
    const { id } = req.params;
    db.serialize(() => {
        const sql = `select * from kontak where id=${id}`;
        db.get(sql, (err, row) => {
            if (err) throw err;
            res.render('detail.ejs', { kontak: row });
        });
    });
});

app.post('/', (req, res) => {
    //Tambah Data
    const { nama, nohp } = req.body;
    db.serialize(() => {
        const sql = `insert into kontak(nama,nohp) values('${nama}','${nohp}')`;
        db.run(sql, (err, rows) => {
            if (err) throw err;
            res.redirect('/');
        });
    });
});

app.get('/:id/edit', (req, res) => {
    //Edit Data
    const { id } = req.params;
    db.serialize(() => {
        const sql = `select * from kontak where id=${id}`;
        db.get(sql, (err, row) => {
            if (err) throw err;
            res.render('edit.ejs', { kontak: row });
        });
    });
});

app.post('/:id/edit', (req, res) => {
    //Simpan Edit Data
    const { id } = req.params;
    const { nama, nohp } = req.body;
    db.serialize(() => {
        const sql = `update kontak set nama='${nama}' , nohp='${nohp}' where id=${id}`;
        db.run(sql, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    });
});

app.get('/:id/delete', (req, res) => {
    //Hapus Data
    const { id } = req.params;
    db.serialize(() => {
        const sql = `delete from kontak where id = ${id}`;
        db.run(sql, (err, rows) => {
            if (err) throw err;
            res.redirect('/');
        });
    });
});

app.listen(8080, () => {
    console.log('Program Berjalan');
});