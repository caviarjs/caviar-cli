const {Command} = require('bin-tool')
// const log = require('util').debuglog('caviar-cli')
const chalk = require('chalk')
const {inspect} = require('util')

const {
  createOptions,
  optionGroups,
  PRINT_OPTIONS
} = require('./options')
const {WorkingMode} = require('./working-mode')

const format = s => inspect(s, {
  colors: true
})

class CaviarCommand extends Command {
  constructor ({
    defaultCaviarConfig
  } = {}, argv) {
    super(argv)

    this.options = createOptions({
      defaultCaviarConfig
    })

    this.optionGroups = optionGroups
  }

  async run ({
    argv
  }) {
    const {
      preset,
      configFile,
      cwd,
      dev,
      sandbox,
      phase
    } = argv

    const {
      caviar,
      monitor
    } = new WorkingMode(cwd).caviar

    const options = {
      preset,
      configFile,
      cwd,
      dev,
      sandbox
    }

    this._printOptions(options, argv)

    const ret = await caviar(options).run(phase)

    if (sandbox) {
      const subprocess = ret

      monitor(subprocess).catch(err => {
        console.error(err.stack)
        process.exit(1)
      })

      await subprocess.ready()
    }
  }

  _printOptions (options, argv) {
    if (!argv[PRINT_OPTIONS]) {
      return
    }

    console.log(chalk.bold('caviar options'))

    for (const [key, value] of Object.entries(options)) {
      console.log(`  - ${key}: ${format(value)}`)
    }
  }

  showVersion () {
    console.log(`cli version: ${require('../package.json').version}`)

    const {
      version
    } = new WorkingMode(process.cwd()).caviar

    console.log(`client version: ${version}`)
  }
}

module.exports = {
  Command: CaviarCommand,
  WorkingMode
}
