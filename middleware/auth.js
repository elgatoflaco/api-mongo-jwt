'use strict'

const services = require('../services')

function isAuth (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'Forbidden' })
  }

  const token = req.headers.authorization.split(' ')[1]

  services.decodeToken(token)
    .then(response => {
      req.user = response
      next()
    })
    .catch(response => {
      res.status(response.status)
    })
}

module.exports = isAuth

// middleware.js
// var jwt = require('jwt-simple');
// var moment = require('moment');
// var config = require('../config');
//
// function isAuth (req, res, next) {
//   if(!req.headers.authorization) {
//     return res
//       .status(403)
//       .send({message: "Tu petición no tiene cabecera de autorización"});
//   }
//
//   var token = req.headers.authorization.split(" ")[1];
//   var payload = jwt.decode(token, config.SECRET_TOKEN);
//
//   if(payload.exp <= moment().unix()) {
//      return res
//          .status(401)
//         .send({message: "El token ha expirado"});
//   }
//
//   req.user = payload.sub;
//   next();
// }
//
//
// module.exports = isAuth
