var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

let flash = require('express-flash');
let session = require('express-session');
let mysql = require('mysql');
let connection = require('./lib/db');

var indexRouter = require('./routes/index');
var ClassroomRouter = require('./routes/Classroom');
var TeacherRouter = require('./routes/Teacher');
var SubjectRouter = require('./routes/Subject');
var AboutRouter = require('./routes/About');
var LoginRouter = require('./routes/Login')

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookie: { maxAge: 60000 },
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}))

app.use(flash());

app.use('/', indexRouter);
app.use('/Classrooms', ClassroomRouter);
app.use('/Teachers', TeacherRouter);
app.use('/Subjects', SubjectRouter);
app.use('/About', AboutRouter);
app.use('/Login', LoginRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
