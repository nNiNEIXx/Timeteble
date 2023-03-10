let express = require('express');
let router = express.Router();
let dbCon = require('../lib/db');

router.get('/', (req, res, next) => {
    dbCon.query('SELECT * FROM Classrooms ORDER BY ClassroomID asc', (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('Classrooms', { data: '' });
        } else {
            res.render('Classrooms', { data: rows });
        }
    })
})

router.get('/add', (req, res, next) => {
    res.render('Classrooms/add', {
        ClassroomName: '',
        ClassroomCode: ''
    })
})

router.post('/add', (req, res, next) => {
    let ClassroomName = req.body.ClassroomName;
    let ClassroomCode = req.body.ClassroomCode;
    let errors = false;

    if (ClassroomName.length === 0 || ClassroomCode.length === 0) {
        errors = true;
        req.flash('error', 'ได้โปรดใส่ข้อมูลให้ครบ');
        res.render('Classrooms/add', {
            ClassroomName: ClassroomName,
            ClassroomCode: ClassroomCode
        })
    }

    if (!errors) {
        let form_data = {
            ClassroomName: ClassroomName,
            ClassroomCode: ClassroomCode
        }

        dbCon.query('INSERT INTO Classrooms SET ?', form_data, (err, result) => {
            if (err) {
                req.flash('error', err)

                res.render('Classrooms/add', {
                    ClassroomName: form_data.ClassroomName,
                    ClassroomCode: form_data.ClassroomCode
                })
            } else {
                req.flash('success', 'เพิ่มห้องเรียนสำเร็จ');
                res.redirect('/Classrooms');
            }
        })
    }
})

router.get('/edit/(:ClassroomID)', (req, res, next) => {
    let ClassroomID = req.params.ClassroomID;

    dbCon.query('SELECT * FROM Classrooms WHERE ClassroomID = ' + ClassroomID, (err, rows, fields) => {
        if (rows.length <= 0) {
            req.flash('error', 'ไม่พบห้องเรียน')
            res.redirect('/Classrooms');
        } else {
            res.render('Classrooms/edit', {
                title: 'Edit book',
                ClassroomID: rows[0].ClassroomID,
                ClassroomName: rows[0].ClassroomName,
                ClassroomCode: rows[0].ClassroomCode
            })
        }
    });
})

router.post('/update/:ClassroomID', (req, res, next) => {
    let ClassroomID = req.params.ClassroomID;
    let ClassroomName = req.body.ClassroomName;
    let ClassroomCode = req.body.ClassroomCode;
    let errors = false;

    if (ClassroomName.length === 0 || ClassroomCode.length === 0) {
        errors = true;
        req.flash('error', 'ได้โปรดใส่ข้อมูลให้ครบ');
        res.render('Classrooms/edit', {
            ClassroomID: req.params.ClassroomID,
            ClassroomName: ClassroomName,
            ClassroomCode: ClassroomCode
        })
    }
    if (!errors) {
        let form_data = {
            ClassroomName: ClassroomName,
            ClassroomCode: ClassroomCode
        }
        dbCon.query("UPDATE Classrooms SET ? WHERE ClassroomID = " + ClassroomID, form_data, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.render('Classrooms/edit', {
                    ClassroomID: req.params.ClassroomID,
                    ClassroomName: form_data.ClassroomName,
                    ClassroomCode: form_data.ClassroomCode
                })
            } else {
                req.flash('success', 'แก้ไขห้องเรียนสำเร็จ');
                res.redirect('/Classrooms')
            }
        })
    }
})

router.get('/delete/(:ClassroomID)', (req, res, next) => {
    let ClassroomID = req.params.ClassroomID;

    dbCon.query('DELETE FROM Classrooms WHERE ClassroomID = ' + ClassroomID, (err, result) => {
        
        if (err) {

            req.flash('error', err),
                res.redirect('/Classrooms');
        } else {
            req.flash('success', 'ลบห้องเรียนสำเร็จ!'),
                res.redirect('/Classrooms');
            ;
        }
    })
})

module.exports = router;