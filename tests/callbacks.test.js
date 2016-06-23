import test from 'tape-promise/tape'
import aw from '../src/aw'

test('> when no error, should return result', async function (t) {
  t.plan(2)

  function fetchMessage (name, callback) {
    setImmediate(function () {
      callback(null, name + ', the secret is...')
    })
  }

  const fetchMessageAwait = aw(fetchMessage)
  const [err, res] = await fetchMessageAwait('jp')

  t.is(res, 'jp, the secret is...', 'got result')
  t.notOk(err, 'error is falsy')

  t.end()
})

test('> when error should return result', async function (t) {
  t.plan(3)

  function fetchMessage (name, callback) {
    setImmediate(function () {
      callback(new Error('what happened'))
    })
  }

  const fetchMessageAwait = aw(fetchMessage)
  const [err, res] = await fetchMessageAwait('jp')

  t.ok(err instanceof Error, 'err is error')
  t.is(err.message, 'what happened', 'error message is set')
  t.ok(typeof res === 'undefined', 'result is undefined')

  t.end()
})

test('> when multiple results, it should return all', async function (t) {
  t.plan(3)

  function fetchMessage (name, callback) {
    setImmediate(function () {
      callback(null, name + ', the secret is...', 'open sesame')
    })
  }

  const fetchMessageAwait = aw(fetchMessage)
  const [err, msg, password] = await fetchMessageAwait('jp')

  t.is(msg, 'jp, the secret is...', 'first callback result')
  t.is(password, 'open sesame', 'second callback result')
  t.notOk(err, 'error is falsy')

  t.end()
})

test('> when array is the return', async function (t) {
  t.plan(3)

  function fetchMessage (name, callback) {
    setImmediate(function () {
      callback(null, [name + ', the secret is...', 'open sesame'])
    })
  }

  const fetchMessageAwait = aw(fetchMessage)
  const [err, vals] = await fetchMessageAwait('jp')
  const [msg, password] = vals

  t.is(msg, 'jp, the secret is...', 'first callback result')
  t.is(password, 'open sesame', 'second callback result')
  t.notOk(err, 'error is falsy')

  t.end()
})

test('> when catch is false', async function (t) {
  function fetchMessage (name, callback) {
    setImmediate(function () {
      callback(null, name + ', the secret is...', 'open sesame')
    })
  }

  const fetchMessageAwait = aw(fetchMessage, { catch: false })
  let res = await fetchMessageAwait('jp')
  t.deepEqual(res, ['jp, the secret is...', 'open sesame'], 'proper result')

  t.end()
})
