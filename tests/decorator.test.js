import test from 'tape-promise/tape'
import aw from '../decorator'

test('> when class has callback function', async function (t) {
  t.plan(2)

  class Fixture {
    @aw
    doSomething (callback) {
      setImmediate(() => {
        callback(null, 'hi')
      })
    }
  }

  var f = new Fixture()
  const [err, res] = await f.doSomething()
  t.ifError(err, 'no error')
  t.is(res, 'hi', 'result set')

  t.end()
})

test('> when class has async function', async function (t) {
  t.plan(2)

  class Fixture {
    @aw
    async doSomething () {
      return 'hi'
    }
  }

  var f = new Fixture()
  const [err, res] = await f.doSomething()
  t.ifError(err, 'no error')
  t.is(res, 'hi', 'result set')

  t.end()
})

test('> when class has Promise function', async function (t) {
  t.plan(2)

  class Fixture {
    @aw
    doSomething () {
      return Promise.resolve('hi')
    }
  }

  var f = new Fixture()
  const [err, res] = await f.doSomething()
  t.ifError(err, 'no error')
  t.is(res, 'hi', 'result set')

  t.end()
})
