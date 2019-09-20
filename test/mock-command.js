const {Command} = require('..')

module.exports = class MockCommand extends Command {
  // constructor (argv) {
  //   super({}, argv)
  // }

  async run ({
    argv
  }) {
    console.log(JSON.stringify(argv))
  }
}
