var express = require('express')
var router = express.Router()
// configuration ===============================================================
// connect to our database

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated()) { return next() }
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/')
}

module.exports = function (passport) {
  // var pagesController = require('../controllers/pagesController.js')

  // var passport = require('passport')
  // var flash = require('connect-flash')
  const userCtrl = require('../controllers/userController')
  const auth = require('../middleware/auth')

// Initial lenguage
  router.get('/es', function (req, res) {
    res.cookie('i18n', 'es')
    res.redirect('/')
  })

  router.get('/en', function (req, res) {
    res.cookie('i18n', 'en')
    res.redirect('/')
  })

  router.post('/users/signup', userCtrl.signUp)
  router.post('/users/authenticate', userCtrl.signIn)
  router.get('/users', auth, userCtrl.getUsers)
  router.post('/users/forgot-password', userCtrl.forgotPassword)
  router.post('/users/reset-password', userCtrl.resetPassword)


  router.get('/api/private', auth, (req, res) => {
    res.status(200).send({ message: 'Allowed' , user: req.user})
  })

  router.get('/api/user/:_id', auth, userCtrl.getUser);

  router.get('/signin', function (req, res) {
		// Display the Login page with any flash message, if any
    res.render('api/signin', { message: req.flash('message') })
  })

// =====================================
// LOGIN ===============================
// =====================================

  router.get('/', function (req, res) {
  // res.setLocale(req.cookies.i18n);
    // console.log(res)
    // Display the Login page with any flash message, if any
    res.render('index', { i18n: res })
  })
// router.get('/', pagesController.index);//route add customer, get n post
/* GET login page. */
  router.get('/login', function (req, res) {
    // Display the Login page with any flash message, if any
    res.render('login', { message: req.flash('message') })
  })

/* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))

/* GET Registration Page */
  router.get('/signup', function (req, res) {
    res.render('signup', {message: req.flash('message')})
  })

/* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
  }))

/* Logout */
  router.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/') // Can fire before session is destroyed?
  })

/* GET Home Page */
  router.get('/home', isAuthenticated, function (req, res) {
    res.render('home', { user: req.user, page_title: 'Home' })
  })

// router.get('/home', isAuthenticated, function(req, res){
//  res.render('home', { user: req.user, page_title: 'Home' });
// });

/* Handle Logout */
  router.get('/signout', function (req, res) {
    req.logout()
    res.redirect('/')
  })

  return router
}
