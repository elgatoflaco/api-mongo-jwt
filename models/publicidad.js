var mongoose = require('mongoose')

module.exports = mongoose.model('Publicidad', {
  name: String,
  file: String,
  thumb: String,
  visible: String
})
