var Promise = require('bluebird')
var once = require('once')

export function awp (fn, _this) {
  return async function (...args) {
    try {
      var result = await fn.apply(_this, args)
      return [result]
    } catch (err) {
      return [undefined, err]
    }
  }
}

export function awc (fn, _this) {
  return async function (...args) {
    try {
      var promiseFn = Promise.promisify(catchify(fn, _this), _this)
      var result = await promiseFn.apply(_this, args)
      return [result]
    } catch (err) {
      return [undefined, err]
    }
  }
}

export function awf (arr) {
  return [].concat.apply([], arr)
}

export function catchify (fn, _this) {
  return function (...args) {
    var callback = args[args.length - 1]
    callback = typeof callback === 'function'
      ? once(callback)
      : Function()

    var finish = once(function () {
      process.removeListener('uncaughtException', finish)
      callback.apply(_this, arguments)
    })

    args[args.length - 1] = finish
    process.once('uncaughtException', finish)

    fn.apply(_this, args)
  }
}
