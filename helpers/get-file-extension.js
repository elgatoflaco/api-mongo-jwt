'use strict'

function getFileExtension (path) {
  let data = path.split('.')

  if (!path.length) return ''
  return data[data.length - 1]
}

module.exports = getFileExtension
