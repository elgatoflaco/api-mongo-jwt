'use strict'

const mongoose = require('mongoose')
const User = require('../models/user')
const service = require('../services')
const uuidv4 = require('uuid/v4')
const mailSender = require('../extra/mail-sender')
const config = require('../config')
var bCrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

function signUp (req, res) {

  var user = new User();
  user.uuid = uuidv4();
  user.displayName = req.body.displayName;
  user.email = req.body.username;
  user.password = req.body.password;
  user.avatar = user.gravatar();
  User.findOne({ email: req.body.username }, function(err, existingUser){
    if(existingUser) {
      res.status(409).send({message: `Account with that email address already exists`})
    } else {
      user.save(function(err, user){
        if (err) {
          console.log(err)
          res.status(500).send({message: `Error accessing database: ${err}`})
        } else {
          console.log(user)
          return res.status(200).send({ token: service.createToken(user), user })
        }
      });
    }
  });


}

function signIn (req, res) {
  User.findOne({ email: req.body.username }, (err, user) => {
    if (err) return res.status(500).send({ message: err })
    if (!user) return res.status(404).send({message: 'User not found!'})

    user.comparePassword(req.body.password, (error, isMatch) => {
      console.log(error)
      if (!isMatch) {
        return res.status(401).send({ message: 'Wrong credentials!' })
      } else {
        req.user = user
        return res.status(200).send({ message: 'Logged in!', token: service.createToken(user), user })
      }
    })
  })
}

function getUser(req, res) {
  User.findOne({ _id: req.params._id }, (err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(404).send({ message: "User not found!" });
    return res
    .status(200)
    .send({
      message: "Allowed",
      user
    });
  });
}

function getUsers(req, res) {
  User.find({}, (err, users) => {
    if (err) return res.status(500).send({ message: err });
    if (!users) return res.status(404).send({ message: "Users not found!" });
    return res
    .status(200)
    .send({
      message: "Allowed",
      users
    });
  }).select('-password');
}


function forgotPassword(req, res) {
  const email = req.body.username || "";
  User.findOne({ "email": email }).exec()
  .then(user => {

    if (user == null) return res.status(404).send({ message: "User not found or probably you used email that is used for google authentification: " + email });
    user.resetExpiryTime = Date.now() + config.passwordResetLinkTimeout;
    user.resetCode = "MUSIC" + crypto.randomBytes(11).toString('hex');
    return user.save()
    .then(user => {
      if (!user) return res.status(500).send({ message: 'An internal error occurred, please try again later' });
      return mailSender.sendPasswordReset(user.email, config.frontEndpoint + "/reset-password/" + user.resetCode)
      .then(() => {
        return res.status(200).send({ message: 'Allowed', recipient: email })
      })
    })
    .catch(err => {
      console.log(`An error occurred when sending the pasword reset email for ${email}: ${err}`);
      return res.status(500).send({ message: 'An internal error occurred, please try again later' })
    })
  })
}

function resetPassword (req, res) {
  const code = String(req.body.code);
  if (!code) return res.status(500).send({ message: 'User not found or probably you used email that is used for google authentification' });

  // const error = FormUtils.checkPasswordStrength(req.body.password);
  // if (error) {
  //   return doRender(req, res, "password-reset.ejs", { message: error });
  // }

  User.findOne({ "resetCode": code }).exec()
  .then(user => {
    // code does not exist or is expired, just go to the login page
    if (!user || !user.email || !user.resetExpiryTime)
    return res.status(500).send({ message: 'The password reset link has expired' });



    // make sure code is not expired
    const expiry = new Date(user.resetExpiryTime).getTime();
    console.log(expiry);
    if (Date.now() > expiry)
    return res.status(500).send({ message: 'The password reset link has expired' });

    user.password = req.body.password;
    user.resetCode = null;
    user.resetExpiryTime = null;

    return user.save()
    .then(() => {
      return res.status(200).send({ message: 'Your password has been reset. Please use new password for login.' });
    })
  })
}
// Generates hash using bCrypt
// var createHash = function (password) {
//   return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
// }

module.exports = {
  signUp,
  signIn,
  getUser,
  getUsers,
  forgotPassword,
  resetPassword
}
