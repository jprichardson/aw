const isFunc = (fn) => typeof fn === 'function'
const isObj = (obj) => obj != null && typeof obj === 'object'

function aw (...args) {
  if (args.length === 2) {
    if (isFunc(args[0]) && isObj(args[1])) return _aw(args[0], args[1])
    if (isObj(args[0]) && isFunc(args[1])) return _aw(args[1], args[0])
    throw new Error('aw uknown types.')
  } else if (args.length === 1) {
    if (isFunc(args[0])) return _aw(args[0])
    if (isObj(args[0])) return (fn) => _aw(fn, args[0])
    throw new Error('aw unknown type.')
  }
  throw new Error('aw incorrect number of parameters')
}

function _aw (fn, options = {}) {
  return async function (...args) {
    const opts = { context: this, injectCallback: true, ...options }
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
    if (options.injectCallback) {
      args.push(function injectedAWCallbackArg (err, ...cbArgs) { err == null ? resolve({ type: 'cb', val: cbArgs }) : reject(err) })
    }

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
