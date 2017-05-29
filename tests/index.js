import test from 'tape'
import aw from '../'

const data = [1, 2, 3, 4]
const error = new Error('Hello')

test('async', (t) => {
  t.test('should circular dependency', (t) => {
    t.equal(aw, aw.async)
    t.end()
  })

  t.test('should return promise', (t) => {
    const result = aw(() => {})()
    t.true(result && typeof result.then === 'function' && typeof result.catch === 'function')
    t.end()
  })

  t.test('arguments should be passed', (t) => {
    aw((...args) => {
      t.same(args, data)
      t.end()
    })(...data)
  })

  t.test('should return error if function return not Promise', async (t) => {
    const [err] = await aw(() => {})()
    t.true(err instanceof TypeError)
    t.equal(err.message, 'Cannot read property \'then\' of undefined')
    t.end()
  })

  t.test('check returned value', async (t) => {
    const [err, ...rest] = await aw(() => Promise.resolve(data))()
    t.ifError(err)
    t.same(rest, data)
    t.end()
  })

  t.test('should return error from function', async (t) => {
    const [err, ...rest] = await aw(() => Promise.reject(error))()
    t.equal(err, error)
    t.same(rest, [])
    t.end()
  })

  t.end()
})

test('sync', (t) => {
  t.test('arguments should be passed', (t) => {
    aw.sync((...args) => {
      t.same(args, data)
      t.end()
    })(...data)
  })

  t.test('check returned value', (t) => {
    const [err, ...rest] = aw.sync(() => data)()
    t.ifError(err)
    t.same(rest, data)
    t.end()
  })

  t.test('should return error from function', (t) => {
    const [err, ...rest] = aw.sync(() => { throw error })()
    t.equal(err, error)
    t.same(rest, [])
    t.end()
  })

  t.end()
})

test('callback', (t) => {
  t.test('arguments should be passed', (t) => {
    aw.callback((...args) => {
      t.same(args.slice(0, -1), data)
      t.equal(typeof args[args.length - 1], 'function')
      t.end()
    })(...data)
  })

  t.test('check returned value', async (t) => {
    const [err, ...rest] = await aw.callback((cb) => cb(null, ...data))()
    t.ifError(err)
    t.same(rest, data)
    t.end()
  })

  t.test('check returned value #2', async (t) => {
    const [err, ...rest] = await aw.callback((cb) => cb(null, data))()
    t.ifError(err)
    t.same(rest, [data])
    t.end()
  })

  t.test('should return error from function', async (t) => {
    const [err, ...rest] = await aw.callback((cb) => cb(error))()
    t.equal(err, error)
    t.same(rest, [])
    t.end()
  })

  t.end()
})
