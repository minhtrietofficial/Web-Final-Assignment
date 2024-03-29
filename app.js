
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
var moneyphoneRouter = require('./routes/moneyphone');
var accountRouter = require('./routes/account');
var accountbanedRouter = require('./routes/accountbaned');
var accountunvailableRouter = require('./routes/accountunvailable');
var approvewithdrawRouter = require('./routes/approvewithdraw');
var approvetransferRouter = require('./routes/approvetransfer');
var historytranRouter = require('./routes/historytran');
var historyuserRouter = require('./routes/historyuser');
var tranpendingRouter = require('./routes/tranpending');
var detailtranRouter = require('./routes/detailtran');

var methodOverride = require('method-override');
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
app.use(methodOverride('_method'));

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
app.use('/moneyphone', moneyphoneRouter);
app.use('/account', accountRouter);
app.use('/accountbaned', accountbanedRouter);
app.use('/accountunvailable', accountunvailableRouter);
app.use('/approvewithdraw', approvewithdrawRouter);
app.use('/approvetransfer', approvetransferRouter);
app.use('/historytran', historytranRouter);
app.use('/tranpending', tranpendingRouter);
app.use('/historyuser', historyuserRouter);
app.use('/detailtran', detailtranRouter);


//--------------------------------------------------------
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
