let express = require('express');
let router = express.Router();
let dbCon = require('../lib/db');

router.get('/', (req, res, next) => {
    dbCon.query('SELECT * FROM Subjects ORDER BY SubjectID asc', (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('Subjects', { data: '' });
        } else {
            res.render('Subjects', { data: rows });
        }
    })
})

router.get('/add', (req, res, next) => {
    res.render('Subjects/add', {
        SubjectCode: '',
        SubjectName: '',
        SubjectDepartment: ''

    })
})

router.post('/add', (req, res, next) => {
    let SubjectCode = req.body.SubjectCode;
    let SubjectName = req.body.SubjectName;
    let SubjectDepartment = req.body.SubjectDepartment;

    let errors = false;

    if (SubjectCode.length === 0 || SubjectName.length === 0 || SubjectDepartment.length === 0) {
        errors = true;
        req.flash('error', 'ได้โปรดใส่ข้อมูลให้ครบ');
        res.render('Subjects/add', {
            SubjectCode: SubjectCode,
            SubjectName: SubjectName,
            SubjectDepartment: SubjectDepartment
        })
    }

    if (!errors) {
        let form_data = {
            SubjectCode: SubjectCode,
            SubjectName: SubjectName,
            SubjectDepartment: SubjectDepartment
        }

        dbCon.query('INSERT INTO Subjects SET ?', form_data, (err, result) => {
            if (err) {
                req.flash('error', err)

                res.render('Subjects/add', {
                    SubjectCode: SubjectCode,
                    SubjectName: SubjectName,
                    SubjectDepartment: SubjectDepartment
                })
            } else {
                req.flash('success', ' เพิ่มรายวิชาเรียบร้อย !');
                res.redirect('/Subjects');
            }
        })
    }
})

router.get('/edit/(:SubjectID)', (req, res, next) => {
    let SubjectID = req.params.SubjectID;

    dbCon.query('SELECT * FROM Subjects WHERE SubjectID = ' + SubjectID, (err, rows, fields) => {
        if (rows.length <= 0) {
            req.flash('error', 'ไม่พบรายวิชา' )
            res.redirect('/Subjects');
        } else {
            res.render('Subjects/edit', {
                title: 'Edit Subjects',
                SubjectID: rows[0].SubjectID,
                SubjectCode: rows[0].SubjectCode,
                SubjectName: rows[0].SubjectName,
                SubjectDepartment: rows[0].SubjectDepartment
            })
        }
    });
})

router.post('/update/:SubjectID', (req, res, next) => {
    let SubjectID = req.params.SubjectID;
    let SubjectCode = req.body.SubjectCode;
    let SubjectName = req.body.SubjectName;
    let SubjectDepartment = req.body.SubjectDepartment;

    let errors = false;

    if (SubjectCode.length === 0 || SubjectName.length === 0 || SubjectDepartment.length === 0) {
        errors = true;
        req.flash('error', 'ได้โปรดใส่ข้อมูลให้ครบ');
        res.render('Subjects/edit', {
            SubjectID: req.params.SubjectID,
            SubjectCode: SubjectCode,
            SubjectName: SubjectName,
            SubjectDepartment: SubjectDepartment
        })
    }
    if (!errors) {
        let form_data = {
            SubjectCode: SubjectCode,
            SubjectName: SubjectName,
            SubjectDepartment: SubjectDepartment
        }
        dbCon.query("UPDATE Subjects SET ? WHERE SubjectID = " + SubjectID, form_data, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.render('Subjects/edit', {
                    SubjectID: req.params.SubjectID,
                    SubjectCode: SubjectCode,
                    SubjectName: SubjectName,
                    SubjectDepartment: SubjectDepartment
                })
            } else {
                req.flash('success', 'แก้ไขข้อมูลรายวิชาสำเร็จ');
                res.redirect('/Subjects')
            }
        })
    }
})

router.get('/delete/(:SubjectID)', (req, res, next) => {
    let SubjectID = req.params.SubjectID;

    dbCon.query('DELETE FROM Subjects WHERE SubjectID = ' + SubjectID, (err, result) => {

        if (err) {

            req.flash('error', err),
                res.redirect('/Subjects');
        } else {
            req.flash('success', 'ลบข้อมูลรายวิชาสำเร็จ'),
                res.redirect('/Subjects');
            ;
        }
    })
})

module.exports = router;