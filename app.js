var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var cookieParser = require('cookie-parser');//session依赖于cookie
var bodyParser = require('body-parser');

var configlist = require('config-lite');

var session = require('express-session');//处理session的中间件
var MongoStore = require('connect-mongo')(session);//数据库
var mongoose = require('mongoose');
var rp = require('request-promise');
mongoose.Promise = require('bluebird');


var flash = require('connect-flash');//flash中间件是用于显示通知，依赖于express-session模块


var routes = require('./routes');//获取路由

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('less-middleware')(path.join(__dirname, 'public')));


//定义cookie解析器
app.use(cookieParser());
app.use(session({
  secret:configlist.mongo.cookieSecret,
  key:configlist.mongo.db,
  resave:true,//每次请求都重新设置session cookie
  saveUninitialized:false,
  cookie:{maxAge:1000*60*60},
  store:new MongoStore({
    url:configlist.mongo.connectionStr
  })
}));

app.use(flash());

app.use(function (req,res,next) {

  res.locals.user = req.session.user;//用户登录信息
  res.locals.config = {
    webBaseUrl:configlist.webBaseUrl,
    prot:configlist.prot
  };
  res.setHeader('Cache-Control','no-cache');
  res.setHeader('Pragma','no-cache');
  //set flash
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});
routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
