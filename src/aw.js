function aw (fn, options = {}) {
  return async function (...args) {
    const opts = { ...options, context: options.context || this }
    try {
      var { type, val } = await wrap(fn, args, opts)
      if (type === 'cb' && Array.isArray(val)) return [null, ...val]
      else return [null, val]
    } catch (err) {
      return [err]
    }
  }
}

function wrap (fn, args, options) {
  return new Promise(function (resolve, reject) {
    args.push(function injectedAWCallbackArg (err, ...cbArgs) { err == null ? resolve({ type: 'cb', val: cbArgs }) : reject(err) })

    let p = fn.apply(options.context, args)
    if (p instanceof Promise) {
      p.then(function (val) {
        resolve({ type: 'p', val })
      }).catch(reject)
    } else if (p) {
      resolve({ type: 's', val: p })
    }
  })
}

module.exports = aw
