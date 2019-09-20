const execa = require('execa')
const {resolve} = require('test-fixture')()

const cli = resolve('..', 'cli.js')

module.exports = async args => {
  const {stdout} = await execa('node', [
    cli,
    ...args
  ])

  return JSON.parse(stdout)
}
