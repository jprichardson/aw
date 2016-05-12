function aw (fn, context) {
  return async function (...args) {
    try {
      var result = await wrap(fn, args, context)
      if (Array.isArray(result)) return [null, ...result]
      else return [null, result]
    } catch (err) {
      return [err]
    }
  }
}

function wrap (fn, args, context) {
  return new Promise(function (resolve, reject) {
    args.push(function injectedAWCallbackArg (err, ...cbArgs) { err == null ? resolve(cbArgs) : reject(err) })

    let p = fn.apply(context, args)
    if (p instanceof Promise) {
      p.then(resolve).catch(reject)
    }
  })
}

module.exports = aw
