const owasp = require('owasp-password-strength-test');
// const sharp = require('sharp');


function checkPasswordStrength(pwd) {
  owasp.config({
    allowPassphrases: false,
    maxLength: 64,
    minLength: 10,
    minOptionalTestsToPass: 4,
  });

  var result = owasp.test(pwd);
  console.log('aquí y ahora')
  return pwd && result.errors.length == 0 ? null : result.errors;
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


module.exports = {
  checkPasswordStrength
}
