'use strict'
const aw = require('./lib/aw')

function awDecorator (target, name, descriptor) {
  var fn = descriptor.value
  return {
    configurable: true,
    get () { return aw(fn, { context: this }) }
  }
}

module.exports = awDecorator
