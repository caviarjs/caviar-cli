const {Command} = require('bin-tool')
const log = require('util').debuglog('caviar-cli')

const {
  createOptions,
  optionGroups
} = require('./options')
const {WorkingMode} = require('./working-mode')

class CaviarCommand extends Command {
  constructor ({
    defaultCaviarConfig
  } = {}) {
    super()

    this.options = createOptions({
      defaultCaviarConfig
    })

    this.optionGroups = optionGroups
  }

  async run ({
    argv: {
      preset,
      configFile,
      cwd,
      dev,
      sandbox,
      phase
    }
  }) {
    const {
      caviar,
      utils: {
        monitor
      }
    } = new WorkingMode(cwd).caviar

    const options = {
      preset,
      configFile,
      cwd,
      dev,
      sandbox
    }

    log('caviar options: %j, phase: %s', options, phase)

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
