let express = require('express');
let router = express.Router();
let dbCon = require('../lib/db');

router.get('/', (req, res, next) => {
    dbCon.query('SELECT * FROM Teachers ORDER BY TeacherID asc', (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('Teachers', { data: '' });
        } else {
            res.render('Teachers', { data: rows });
        }
    })
})

router.get('/add', (req, res, next) => {
    res.render('Teachers/add', {
        TeacherTitle: '',
        TeacherFirstName: '',
        TeacherLastName: ''
    })
})

router.post('/add', (req, res, next) => {
    let TeacherTitle = req.body.TeacherTitle;
    let TeacherFirstName = req.body.TeacherFirstName;
    let TeacherLastName = req.body.TeacherLastName;
    let errors = false;

    if (TeacherTitle.length === 0 || TeacherFirstName.length === 0 || TeacherLastName.length === 0) {
        errors = true;
        req.flash('error', 'ได้โปรดใส่ข้อมูลให้ครบ');
        res.render('Teachers/add', {
            TeacherTitle: TeacherTitle,
            TeacherFirstName: TeacherFirstName,
            TeacherLastName: TeacherLastName
        })
    }

    if (!errors) {
        let form_data = {
            TeacherTitle: TeacherTitle,
            TeacherFirstName: TeacherFirstName,
            TeacherLastName: TeacherLastName
        }

        dbCon.query('INSERT INTO Teachers SET ?', form_data, (err, result) => {
            if (err) {
                req.flash('error', err)

                res.render('Teachers/add', {
                    TeacherTitle: TeacherTitle,
                    TeacherFirstName: TeacherFirstName,
                    TeacherLastName: TeacherLastName
                })
            } else {
                req.flash('success', 'เพิ่มรายชื่อครูสำเร็จ');
                res.redirect('/Teachers');
            }
        })
    }
})

router.get('/edit/(:TeacherID)', (req, res, next) => {
    let TeacherID = req.params.TeacherID;

    dbCon.query('SELECT * FROM Teachers WHERE TeacherID = ' + TeacherID, (err, rows, fields) => {
        if (rows.length <= 0) {
            req.flash('error', 'ไม่พบรายชื่อครู ')
            res.redirect('/Teachers');
        } else {
            res.render('Teachers/edit', {
                title: 'Edit Teacher',
                TeacherID: rows[0].TeacherID,
                TeacherTitle: rows[0].TeacherTitle,
                TeacherFirstName: rows[0].TeacherFirstName,
                TeacherLastName: rows[0].TeacherLastName

            })
        }
    });
})

router.post('/update/:TeacherID', (req, res, next) => {
    let TeacherID = req.params.TeacherID;
    let TeacherTitle = req.body.TeacherTitle;
    let TeacherFirstName = req.body.TeacherFirstName;
    let TeacherLastName = req.body.TeacherLastName;
    let errors = false;

    if (TeacherTitle.length === 0 || TeacherFirstName.length === 0 || TeacherLastName.length === 0) {
        errors = true;
        req.flash('error', 'ได้โปรดใส่ข้อมูลให้ครบ');
        res.render('Teachers/edit', {
            TeacherID: req.params.TeacherID,
            TeacherTitle: TeacherTitle,
            TeacherFirstName: TeacherFirstName,
            TeacherLastName: TeacherLastName
        })
    }
    if (!errors) {
        let form_data = {
            TeacherTitle: TeacherTitle,
            TeacherFirstName: TeacherFirstName,
            TeacherLastName: TeacherLastName
        }
        dbCon.query("UPDATE Teachers SET ? WHERE TeacherID = " + TeacherID, form_data, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.render('Teachers/edit', {
                    TeacherID: req.params.TeacherID,
                    TeacherTitle: TeacherTitle,
                    TeacherFirstName: TeacherFirstName,
                    TeacherLastName: TeacherLastName
                })
            } else {
                req.flash('success', 'แก้ไขรายชื่อครูสำเร็จ');
                res.redirect('/Teachers')
            }
        })
    }
})

router.get('/delete/(:TeacherID)', (req, res, next) => {
    let TeacherID = req.params.TeacherID;

    dbCon.query('DELETE FROM Teachers WHERE TeacherID = ' + TeacherID, (err, result) => {
        
        if (err) {

            req.flash('error', err),
                res.redirect('/Teachers');
        } else {
            req.flash('success', 'ลบรายชื่อครูสำเร็จ'),
                res.redirect('/Teachers');
            ;
        }
    })
})

module.exports = router;