const test = require('ava')
const run = require('./run')

test('basic', async t => {
  const argv = await run(['--preset', 'foo'])
  t.is(argv.preset, 'foo')
})
