let express = require('express');
let router = express.Router();
let dbCon = require('../lib/db');

router.get('/', function (req, res, next) {
    res.render('User');
});

router.get('/login', function (req, res, next) {
    res.render('User/login', {
        username: '',
        password: ''
    })
})

router.post('/login', function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        dbCon.query('SELECT * FROM accounts WHERE Username = ? AND Password = ?', [username, password], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                req.flash('success', "สวัดดีคุณ  " + username)
                req.flash('User', username)

                res.redirect('/User');
            } else {
                req.flash('Incorrect', "ชื่อผู้ใช้ หรือ รหัสผ่านผิด")
                res.redirect('login');

            }
            res.end();
        });
    } else {
        req.flash('Incorrect', "ได้โปรดใส่ข้อมูลให้ครบ")
        res.redirect('login');
    }
})

router.get('/register', function (req, res, next) {
    res.render('User/register', {
        username: '',
        password: '',
        confirmpassword: ''
    })

});

router.post('/register', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword
    let errors = false;


    if (password != confirmpassword){
        errors = true;
        req.flash('error', 'รหัสผ่านไม่ตรงกัน');
        res.render('User/register', {
            username: username,
            password: password,
            confirmpassword: confirmpassword
        })
    }

    if (username.length === 0 || password.length === 0) {
        errors = true;
        req.flash('error', 'ได้โปรดใส่ข้อมูลให้ครบ');
        res.render('User/register', {
            username: username,
            password: password,
            confirmpassword: confirmpassword
        })
    }

    let form_data = {
        username: username,
        password: password
    }

    if (!errors) {
        dbCon.query('SELECT * FROM accounts WHERE Username = ?', [username], function (error, results, fields) {
            if (results.length > 0) {
                req.flash('repetitive', "ชื่อผู้ใช้ ซ้ำ")
                res.redirect('register');
            }
            else
                dbCon.query('INSERT INTO accounts SET ?', form_data, (err) => {
                    if (err) {
                        req.flash('error', err)

                        res.render('register', {
                            username: username,
                            password: password,
                            confirmpassword: confirmpassword
                        })
                    } else {
                        res.redirect('login');
                    }
                })
        });
    }
}
)

module.exports = router;