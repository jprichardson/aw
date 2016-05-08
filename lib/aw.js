'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awp = awp;
exports.awc = awc;
exports.awf = awf;
exports.catchify = catchify;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var Promise = require('bluebird');
var once = require('once');

function awp(fn, _this) {
  return (() => {
    var ref = _asyncToGenerator(function* () {
      try {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var result = yield fn.apply(_this, args);
        return [result];
      } catch (err) {
        return [undefined, err];
      }
    });

    return function (_x) {
      return ref.apply(this, arguments);
    };
  })();
}

function awc(fn, _this) {
  return (() => {
    var ref = _asyncToGenerator(function* () {
      try {
        var promiseFn = Promise.promisify(catchify(fn, _this), _this);

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var result = yield promiseFn.apply(_this, args);
        return [result];
      } catch (err) {
        return [undefined, err];
      }
    });

    return function (_x2) {
      return ref.apply(this, arguments);
    };
  })();
}

function awf(arr) {
  return [].concat.apply([], arr);
}

function catchify(fn, _this) {
  return function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var callback = args[args.length - 1];
    callback = typeof callback === 'function' ? once(callback) : Function();

    var finish = once(function () {
      process.removeListener('uncaughtException', finish);
      callback.apply(_this, arguments);
    });

    args[args.length - 1] = finish;
    process.once('uncaughtException', finish);

    fn.apply(_this, args);
  };
}
