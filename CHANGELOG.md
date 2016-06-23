0.1.0 / 2016-06-22
------------------
- parameter ordering doesn't matter... i.e.

```js
aw(fn, opts)
```

is the same as

```js
aw(opts, fn)
```

- now MOOAAAR functional

```js
aw(opts, fn) === aw(opts)(fn)
```



0.0.4 / 2016-05-19
------------------
- bug fix, proper array spreading (only when wrapping a callback)

0.0.3 / 2016-05-18
------------------
- bug fix `this` and proper context

0.0.2 / 2016-05-13
------------------
- compile w/ Babel 6.x
- upgrade Standard v7
- changed order of results tuple
- added decorator support
- changed `context` to `options`, set `options.context`

0.0.1 / 2015-07-22
------------------
- initial release
