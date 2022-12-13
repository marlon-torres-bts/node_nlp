var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var nlpRouter = require('./routes/nlp');
var sentimentRouter = require('./routes/sentiment');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
console.log('Se me volvio a chispotear:', USER_PASS);
console.log('Contraseña para el correo', EMAIL_PASS);

app.use('/', indexRouter);
app.use('/api/nlp', nlpRouter);
app.use('/api/sentiment', sentimentRouter)

module.exports = app;
