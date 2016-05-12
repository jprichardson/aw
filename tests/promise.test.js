import test from 'tape-promise/tape'
import aw from '../src/aw'

test('aw: > when return promise it should return result', async function (t) {
  t.plan(5)

  function fetchMessage (name) {
    return new Promise(function (resolve, reject) {
      if (typeof name === 'string') return resolve('hello ' + name)
      else return reject(new Error('Must pass name.'))
    })
  }

  const fetchMessageAwait = aw(fetchMessage)
  const [err, res] = await fetchMessageAwait('jp')

  t.is(res, 'hello jp', 'result exists')
  t.notOk(err, 'error is falsy')

  const [err2, res2] = await fetchMessageAwait()

  t.notOk(res2, 'result is falsy')
  t.ok(err2, 'error is truthy')
  t.is(err2.message, 'Must pass name.', 'err message is set')

  t.end()
})
