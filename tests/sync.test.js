import test from 'tape-promise/tape'
import aw from '../src/aw'

test('> when error is thrown it should return result', async function (t) {
  t.plan(3)

  function fetchMessage (name) {
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

  function fetchMessage (name) {
    return 'hello ' + name
  }

  const fetchMessageAwait = aw(fetchMessage)
  const [err, res] = await fetchMessageAwait('jp')

  t.is(res, 'hello jp', 'result is set')
  t.notOk(err, 'error is falsy')

  t.end()
})
