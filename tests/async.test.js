import test from 'tape-promise/tape'
import delay from 'delay'
import aw from '../src/aw'

test('> when error is thrown it should return result', async function (t) {
  t.plan(3)

  async function fetchMessage (name) {
    throw new Error('another error')
  }
  const fetchMessageAwait = aw(fetchMessage)

  let [err, res] = await fetchMessageAwait('jp')
  t.ok(err instanceof Error, 'err is error')
  t.is(err.message, 'another error', 'proper error message')
  t.is(typeof res, 'undefined', 'no error result')

  t.end()
})

test('> when sync it should return result', async function (t) {
  t.plan(2)

  async function fetchMessage (name) {
    return 'hello ' + name
  }

  const fetchMessageAwait = aw(fetchMessage)
  const [err, res] = await fetchMessageAwait('jp')

  t.is(res, 'hello jp', 'result is set')
  t.notOk(err, 'error is falsy')

  t.end()
})

test('> when using this', async function (t) {
  t.plan(7)

  async function fetchMessage () {
    return 'hello ' + this.name
  }

  let o = { name: 'jp' }
  o.fetchMessage = fetchMessage

  var msg = await o.fetchMessage()
  t.is(msg, 'hello jp', 'original result is set')

  o.fetchMessageAwait = aw(o.fetchMessage, { context: o })
  let [err, res] = await o.fetchMessageAwait()
  t.is(res, 'hello jp', 'result is set')
  t.notOk(err, 'error is falsy')

  // switch parameter order
  o.fetchMessageAwait = aw({ context: o }, o.fetchMessage)
  ;[err, res] = await o.fetchMessageAwait()
  t.is(res, 'hello jp', 'result is set')
  t.notOk(err, 'error is falsy')

  // functional
  o.fetchMessageAwait = aw({ context: o })(o.fetchMessage)
  ;[err, res] = await o.fetchMessageAwait()
  t.is(res, 'hello jp', 'result is set')
  t.notOk(err, 'error is falsy')

  t.end()
})

test('> proper context in object', async function (t) {
  t.plan(2)

  var o = {
    get name () { return 'jp' },
    fetchName: aw(async function () {
      return this.name
    })
  }

  let [err, name] = await o.fetchName()
  t.ifError(err, 'no error')
  t.is(name, 'jp', 'name is properly set => this is correct')

  t.end()
})

test('> when returning an array', async function (t) {
  t.plan(2)

  async function fetchMessage (name) {
    await delay(10)
    return ['hello ' + name]
  }

  const fetchMessageAwait = aw(fetchMessage)
  const [err, res] = await fetchMessageAwait('jp')

  t.deepEqual(res, ['hello jp'], 'result is set an an array')
  t.ifError(err, 'no error')

  t.end()
})
