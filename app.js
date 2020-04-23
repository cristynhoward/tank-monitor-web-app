const { auth, requiresAuth } = require('express-openid-connect');
var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var dotenv = require('dotenv');
var path = require('path');

require('./config.js')();
dotenv.config();

var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');

var app = express();

const authConfig = {
  required: false,
  auth0Logout: true,
  baseURL: 'https://' + process.env.BASE_URL,
  issuerBaseURL: 'https://' + process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  appSessionSecret: process.env.SESS_SECRET
};

app.use(auth(authConfig));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use(config.urls.dashboard, requiresAuth(), dashboardRouter);


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
