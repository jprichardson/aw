'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.awp = awp;
exports.awc = awc;
exports.awf = awf;
exports.catchify = catchify;
var Promise = require('bluebird');
var once = require('once');

function awp(fn, _this) {
  return function callee$1$0() {
    var _len,
        args,
        _key,
        result,
        args$2$0 = arguments;

    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.prev = 0;

          for (_len = args$2$0.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = args$2$0[_key];
          }

          context$2$0.next = 4;
          return regeneratorRuntime.awrap(fn.apply(_this, args));

        case 4:
          result = context$2$0.sent;
          return context$2$0.abrupt('return', [result]);

        case 8:
          context$2$0.prev = 8;
          context$2$0.t0 = context$2$0['catch'](0);
          return context$2$0.abrupt('return', [undefined, context$2$0.t0]);

        case 11:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this, [[0, 8]]);
  };
}

function awc(fn, _this) {
  return function callee$1$0() {
    var promiseFn,
        _len2,
        args,
        _key2,
        result,
        args$2$0 = arguments;

    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.prev = 0;
          promiseFn = Promise.promisify(catchify(fn, _this), _this);

          for (_len2 = args$2$0.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = args$2$0[_key2];
          }

          context$2$0.next = 5;
          return regeneratorRuntime.awrap(promiseFn.apply(_this, args));

        case 5:
          result = context$2$0.sent;
          return context$2$0.abrupt('return', [result]);

        case 9:
          context$2$0.prev = 9;
          context$2$0.t0 = context$2$0['catch'](0);
          return context$2$0.abrupt('return', [undefined, context$2$0.t0]);

        case 12:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this, [[0, 9]]);
  };
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
