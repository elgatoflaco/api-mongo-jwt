var express = require('express')
var expressValidator = require('express-validator')
var util = require('util')
var path = require('path')
var favicon = require('serve-favicon')
var qs = require('querystring')

// session variables and body parser
var bodyParser = require('body-parser')
var session = require('express-session')
var flash = require('express-flash')
var app = express()

var morgan = require('morgan') // log every request to the console
var cookieParser = require('cookie-parser') // read cookies (needed for auth)
require('dotenv').config()

var timeout = require('connect-timeout')
app.use((req, res, next) => {
  const origin = req.get('origin');

  // TODO Add origin validation
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
});
// const formidable = require('express-formidable');
// app.use(formidable({
//   encoding: 'utf-8',
//   uploadDir: './uploads',
//   // multiples: true, // req.files to be arrays of files
// }));

// var i18n=require("i18n-express"); // <-- require the module
var i18n = require('i18n')
i18n.configure({

// define how many languages we would support in our application
  locales: ['es', 'en'],

// define the path to language json files, default is /locales
  directory: __dirname + '/locales',

// define the default language
  defaultLocale: 'en',

// define a custom cookie name to parse locale settings from
  cookie: 'i18n'
})

app.use(cookieParser('i18n_demo'))

app.use(session({
  secret: 'i18n_demo',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

// init i18n after cookie-parser
app.use(i18n.init)

app.use(flash())

// configuration ===============================================================
// connect to our database
var flash = require('connect-flash')
var config = require('./config')
var mongoose = require('mongoose')
mongoose.connect(config.db,{ useMongoClient: true });

// Configuring Passport
var passport = require('passport')
var expressSession = require('express-session')

app.use(expressSession({
  secret: 'i18n_demo',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
// init i18n after cookie-parser
// app.use(i18n.init);
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
// var flash = require('connect-flash')
app.use(flash()) // use connect-flash for flash messages stored in session

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static(path.join(__dirname, 'public')))

app.use(expressValidator()) // validaciones de formularios

// Initialize Passport
var initPassport = require('./passport/init')
initPassport(passport)

// // LO USABA PARA SUBIR FICHEROS, PERO ES INCOMPATIBLE CON MULTER Y FORMIDABLE, ASÍ QUE LO HE DESACTIVADO, ESPEREMOS QUE NO FALLE NADA.
// var fileUpload = require('express-fileupload');
// // default options
// app.use(fileUpload());

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static(__dirname + '/public'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// This middleware allow us to use req.session.variable = "blah"
// Check the documentation here on how to set it up because there are a couple
// of mandatory options
// https://github.com/expressjs/session
// app.use(session({
//     secret: "gandalfPoderos0",
//     resave: false,
//     saveUninitialized: true
// }));

// we cannot use req.session.variable in the views so we have to use an intermediate
// "local" variable to put this data and pass it to the view
// We can access our session variables from the view through the "session" variable
app.use(function (req, res, next) {
  res.locals.session = req.session
  res.locals.number = 0
  next()
})

// basic routes
var routes = require('./routes/index')(passport)
app.use('/', routes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

// var timeout = require('connect-timeout'); //express v4
// app.use(timeout(1200000));

app.use(function (req, res, next) {
  res.setTimeout(480000, function () { // 4 minute timeout adjust for larger uploads
    console.log('Request has timed out.')
    res.send(408)
  })

  next()
})
console.log(process.env.SENDGRID_API_KEY)
module.exports = app
