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

test('with config', async t => {
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

test('profile + phase', async t => {
  const cwd = resolve('profile')
  const phase = 'build'

  const argv = await run([
    '--cwd',
    cwd,
    '--profile', 'foo',
    '--phase', phase
  ])

  const config = {
    ...require(resolve('profile', 'caviar.config.js')).profiles.foo
  }

  delete config.phases

  t.deepEqual(argv, {
    ...config,
    cwd,
    sandbox: false,
    phase
  })
})

test('no profile, phase', async t => {
  const cwd = resolve('profile')
  const phase = 'build'

  const argv = await run([
    '--cwd',
    cwd,
    '--phase', phase
  ])

  const config = {
    ...require(resolve('profile', 'caviar.config.js'))
  }

  delete config.profiles
  delete config.phases

  t.deepEqual(argv, {
    ...config,
    cwd,
    dev: false,
    phase
  })
})

test('DEFAULT_CONFIG_NOT_FOUND', async t => {
  const cwd = resolve('empty')

  await t.throwsAsync(() => run([
    '--cwd',
    cwd
  ]), /caviar\.config not found/)
})

test('ERR_LOAD_CAVIAR_CONFIG', async t => {
  await t.throwsAsync(() => run([
    '--cwd',
    resolve('err-config')
  ]), /fails to load caviar.config/)
})

test('NO_PROFILES', async t => {
  await t.throwsAsync(() => run([
    '--cwd',
    resolve('config'),
    '--profile', 'foo'
  ]), /"profiles" field should be provided/)
})

test('PROFILE_NOT_FOUND', async t => {
  await t.throwsAsync(() => run([
    '--cwd',
    resolve('profile'),
    '--profile', 'not-found'
  ]), /is not found/)
})

test('PHASE_CONFLICT', async t => {
  await t.throwsAsync(() => run([
    '--cwd',
    resolve('profile'),
    '--profile', 'foo',
    '--phase', 'conflict'
  ]), /phase "conflict" is not allowed/)
})
