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
var detailuserRouter = require('./routes/detailuser');
var updateinfoRouter = require('./routes/updateinfo');
var moneyrechargeRouter = require('./routes/moneyrecharge');
var moneywithdrawRouter = require('./routes/moneywithdraw');
var moneytransfersRouter = require('./routes/moneytransfers');
var accountRouter = require('./routes/account');
var accountbanedRouter = require('./routes/accountbaned');
var accountunvailableRouter = require('./routes/accountunvailable');
var approvewithdrawRouter = require('./routes/approvewithdraw');
var approvetransferRouter = require('./routes/approvetransfer');

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
app.use('/detailuser', detailuserRouter);
app.use('/updateinfo', updateinfoRouter);
app.use('/moneyrecharge', moneyrechargeRouter);
app.use('/moneywithdraw', moneywithdrawRouter);
app.use('/moneytransfers', moneytransfersRouter);
app.use('/account', accountRouter);
app.use('/accountbaned', accountbanedRouter);
app.use('/accountunvailable', accountunvailableRouter);
app.use('/approvewithdraw', approvewithdrawRouter);
app.use('/approvetransfer', approvetransferRouter);

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
