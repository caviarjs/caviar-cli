const execa = require('execa')
const {resolve} = require('test-fixture')()

const cli = resolve('..', 'cli.js')

const run = async args => {
  let stdout

  try {
    ({stdout} = await execa('node', [
      cli,
      ...args
    ]))
  } catch (err) {
    throw new Error(err.stderr)
  }

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
