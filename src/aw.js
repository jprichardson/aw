const isFunc = (fn) => typeof fn === 'function'
const isObj = (obj) => obj != null && typeof obj === 'object'

function wrap (fn, args, options) {
  return new Promise((resolve, reject) => {
    if (options.injectCallback) {
      args.push(function injectedAWCallbackArg (err, ...cbArgs) {
        err == null ? resolve(cbArgs) : reject(err)
      })
    }

    // call fn in Promise, because fn can be synchronous functions and throw error
    const p = fn.apply(options.context, args)
    if (!options.injectCallback) return Promise.resolve(p).then(resolve, reject)
  })
}

function _aw (fn, options) {
  options = Object.assign({ injectCallback: false, catch: true }, options)

  return async function (...args) {
    const opts = Object.assign({ context: this }, options)
    if (!opts.catch) return wrap(fn, args, opts)

    return wrap(fn, args, opts)
      .then((val) => {
        if (opts.injectCallback && Array.isArray(val)) return [null, ...val]
        else return [null, val]
      }, (err) => [err])
  }
}

function aw (...args) {
  switch (args.length) {
    case 1:
      if (isFunc(args[0])) return _aw(args[0])
      if (isObj(args[0])) return (fn) => _aw(fn, args[0])
      throw new Error('aw unknown type.')

    case 2:
      if (isFunc(args[0]) && isObj(args[1])) return _aw(args[0], args[1])
      if (isObj(args[0]) && isFunc(args[1])) return _aw(args[1], args[0])
      throw new Error('aw uknown types.')

    default:
      throw new Error('aw incorrect number of parameters.')
  }
}

module.exports = aw
