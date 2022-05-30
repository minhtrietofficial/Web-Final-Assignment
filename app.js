var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var credentials = require('./credentials');
var mongoose = require('mongoose');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');
var registerRouter = require('./routes/register');
var logoutRouter = require('./routes/logout');

var loginRouter = require('./routes/login');
var resetpasswordRouter = require('./routes/resetpassword');
var changepasswordRouter = require('./routes/changepassword');
var activeaccountRouter = require('./routes/activeaccount');

var app = express();

// connect mongodb
mongoose.connect(credentials.mongo.connectionString.development);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: credentials.session.key }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/activeaccount', activeaccountRouter);
app.use('/resetpassword', resetpasswordRouter);
app.use('/changepassword', changepasswordRouter);
//test---------------------------------------------------
var home1Router = require('./routes/home1');
app.use('/home1', home1Router);

//--------------------------------------------------------
app.get('/login', (req, res) => {
  let context = {
    title: 'Login | BKTPay',
    layout: 'sublayout'
  }
  res.render('login', context);
});

app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  res.send(`Username: ${username} Password: ${password}`);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
