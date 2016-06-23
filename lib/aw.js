'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const isFunc = fn => typeof fn === 'function';
const isObj = obj => obj != null && typeof obj === 'object';

function aw() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 2) {
    if (isFunc(args[0]) && isObj(args[1])) return _aw(args[0], args[1]);
    if (isObj(args[0]) && isFunc(args[1])) return _aw(args[1], args[0]);
    throw new Error('aw uknown types.');
  } else if (args.length === 1) {
    if (isFunc(args[0])) return _aw(args[0]);
    if (isObj(args[0])) return (() => {
      var ref = _asyncToGenerator(function* (fn) {
        return _aw(fn, args[0]);
      });

      return function (_x) {
        return ref.apply(this, arguments);
      };
    })();
    throw new Error('aw unknown type');
  }
  throw new Error('aw incorrect number of parameters');
}

function _aw(fn) {
  let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (() => {
    var ref = _asyncToGenerator(function* () {
      const opts = _extends({}, options, { context: options.context || this });
      try {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var _ref = yield wrap(fn, args, opts);

        var type = _ref.type;
        var val = _ref.val;

        if (type === 'cb' && Array.isArray(val)) return [null].concat(_toConsumableArray(val));else return [null, val];
      } catch (err) {
        return [err];
      }
    });

    return function (_x3) {
      return ref.apply(this, arguments);
    };
  })();
}

function wrap(fn, args, options) {
  return new Promise(function (resolve, reject) {
    args.push(function injectedAWCallbackArg(err) {
      for (var _len3 = arguments.length, cbArgs = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        cbArgs[_key3 - 1] = arguments[_key3];
      }

      err == null ? resolve({ type: 'cb', val: cbArgs }) : reject(err);
    });

    let p = fn.apply(options.context, args);
    if (p instanceof Promise) {
      p.then(function (val) {
        resolve({ type: 'p', val: val });
      }).catch(reject);
    } else if (p) {
      resolve({ type: 's', val: p });
    }
  });
}

module.exports = aw;
