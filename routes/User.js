let express = require('express');
let router = express.Router();
const passport = require('passport')

router.get('/', function (req, res, next) {
    res.render('User');
});

router.get('/login', function (req, res, next) {
    res.render('User/login');
});

router.get('/register', function (req, res, next) {
    res.render('User/register');
});

module.exports = router;