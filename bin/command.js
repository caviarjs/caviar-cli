// const {resolve} = require('path')
// const minimist = require('minimist')

// const {
//   config: argvConfig
// } = minimist(process.argv.slice(2))

// const cwd = process.cwd()

// let config

// if (argvConfig) {
//   configFile = resolve(cwd, argvConfig)
// }


// const command = parsed._[0]

const {Command} = require('bin-tool')

module.exports = class CaviarCommand extends Command {
  constructor () {
    super()

    this.options = {

    }
  }
}
