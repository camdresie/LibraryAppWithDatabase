var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {sequelize} = require('./models');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/**
 * Asynchronous error handling function that checks if a database connection has been successsfully established. If it has, a success message will be logged to the console.
 * If not, there will be an unsuccessful message logged to the console. 
 */
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful!");
  } catch (error){
    console.error("Database connection unsuccessful." + error);
  }
})();

// catch 404 error and forward to global error handler
app.use(function(req, res, next) {
  const notFound = new Error();
  notFound.status = 404;
  notFound.message = "Sorry, the page wasn't found!"; 
  next(notFound);
});

// error handler - will render not found page if the error is a 404 or will render a different page if the error is anything else
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if (err.status == 404){
    res.render('page-not-found', {err, title: "Page Not Found"});
  } else {
    // render the error page for errors other than 404
    res.status(err.status || 500);
    if (!err.status){
      err.status = 500;
    }
    if (!err.message){
      err.message = "Sorry, an error occurred! Try again";
    }
    console.log("Error status: " + err.status + "\nError message: " + err.message);
    res.render('error', {err, title: "Page Not Found"});
  }
});

module.exports = app;
