const execa = require('execa')
const {resolve} = require('test-fixture')()

const cli = resolve('..', 'cli.js')

const run = async args => {
  const {stdout} = await execa('node', [
    cli,
    ...args
  ])

  const {
    preset,
    configFile,
    cwd,
    dev,
    sandbox,
    phase
  } = JSON.parse(stdout)

  return {
    preset,
    configFile,
    cwd,
    dev,
    sandbox,
    phase
  }
}

module.exports = {
  run,
  resolve
}
