var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require('cors');

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin/admin');
var projectCatRouter = require('./routes/projectCategory');
var projectRouter = require('./routes/project');
var resumeRouter = require('./routes/resume');

var app = express();
app.use(cors());

// const { createProxyMiddleware } = require('http-proxy-middleware');
// app.use('/api', createProxyMiddleware({ 
//     target: 'http://localhost:5000/', //original url
//     changeOrigin: true, 
//     //secure: false,
//     onProxyRes: function (proxyRes, req, res) {
//        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
//     }
// }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, '/public/uploads')));


// app.use(function(req,res,next){
//   res.header("Access-Control-Allow-Origin","*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin,X-Requested-With,Content-Type,Accept,Authorization"
//   );
//   res.header('Access-Control-Allow-Methods','GET,PUT,PATCH,POST,DELETE,OPTIONS');
//   next();
// });



// app.use(function(req,res,next){
//   res.header("Access-Control-Allow-Origin","*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin,X-Requested-With,Content-Type,Accept,Authorization"
//   );
//   res.header('Access-Control-Allow-Methods','GET,PUT,PATCH,POST,DELETE,OPTIONS');
//   next();
// });

app.use('/api', userRouter);
app.use('/api',adminRouter);
app.use('/api',projectCatRouter);
app.use('/api',projectRouter);
app.use('/api',resumeRouter);

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
  // res.render('error');

  res.status(404).json({
    error:"Page Not Found"
  })

  res.status(500).json({
    error:"Internal Server Error"
  })

});

module.exports = app;
