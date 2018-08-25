var fs = require('fs')
var request = require('request'),
  cheerio = require('cheerio')

exports.index = function (req, res, next) {
  res.setLocale(req.cookies.i18n)
	    res.render('index', {
      i18n: res
    })
}
