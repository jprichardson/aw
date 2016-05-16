"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function aw(fn) {
  let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (() => {
    var ref = _asyncToGenerator(function* () {
      const opts = _extends({}, options, { context: options.context || this });
      try {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var result = yield wrap(fn, args, opts);
        if (Array.isArray(result)) return [null].concat(_toConsumableArray(result));else return [null, result];
      } catch (err) {
        return [err];
      }
    });

    return function (_x2) {
      return ref.apply(this, arguments);
    };
  })();
}

function wrap(fn, args, options) {
  return new Promise(function (resolve, reject) {
    args.push(function injectedAWCallbackArg(err) {
      for (var _len2 = arguments.length, cbArgs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        cbArgs[_key2 - 1] = arguments[_key2];
      }

      err == null ? resolve(cbArgs) : reject(err);
    });

    let p = fn.apply(options.context, args);
    if (p instanceof Promise) {
      p.then(resolve).catch(reject);
    } else if (p) {
      resolve(p);
    }
  });
}

module.exports = aw;
