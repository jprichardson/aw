function aw (fn, options = {}) {
  return async function (...args) {
    try {
      var result = await wrap(fn, args, options)
      if (Array.isArray(result)) return [null, ...result]
      else return [null, result]
    } catch (err) {
      return [err]
    }
  }
}

function wrap (fn, args, options) {
  return new Promise(function (resolve, reject) {
    args.push(function injectedAWCallbackArg (err, ...cbArgs) { err == null ? resolve(cbArgs) : reject(err) })

    let p = fn.apply(options.context, args)
    if (p instanceof Promise) {
      p.then(resolve).catch(reject)
    } else if (p) {
      resolve(p)
    }
  })
}

module.exports = aw
