const {Command} = require('bin-tool')

const options = require('./options')

module.exports = class CaviarCommand extends Command {
  constructor () {
    super()

    this.options = options
  }

  async run ({
    argv
  }) {

  }
}
