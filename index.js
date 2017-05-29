'use strict'
module.exports = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve, reject) {
      fn.apply(null, args).then(function (result) {
        resolve([null].concat(result))
      }, reject)
    })
    .catch(function (err) { return [err] })
  }
}
module.exports.async = module.exports

module.exports.sync = function (fn) {
  return function () {
    try {
      return [null].concat(fn.apply(null, arguments))
    } catch (err) {
      return [err]
    }
  }
}

module.exports.callback = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve, reject) {
      args.push(function (err) {
        if (err) reject(err)
        else resolve(Array.prototype.slice.call(arguments))
      })

      fn.apply(null, args)
    })
    .catch(function (err) { return [err] })
  }
}
