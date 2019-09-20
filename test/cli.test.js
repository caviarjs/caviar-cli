const test = require('ava')
const {
  run,
  resolve
} = require('./run')

test('basic', async t => {
  const argv = await run(['--preset', 'foo'])

  t.deepEqual(argv, {
    preset: 'foo',
    configFile: undefined,
    cwd: process.cwd(),
    sandbox: false,
    dev: false,
    phase: 'default'
  })
})

test.only('with config', async t => {
  const cwd = resolve('config')

  const argv = await run([
    '--cwd',
    cwd
  ])

  t.deepEqual(argv, {
    ...require(resolve('config', 'caviar.config.js')),
    cwd
  })
})
