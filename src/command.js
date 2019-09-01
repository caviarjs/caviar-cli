const {Command} = require('bin-tool')

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

    // caviarOptions
    // - preset
    // - configFile
    // - cwd
    // - dev
    // - sandbox

    // cliOptions
    // - phase

    const ret = await caviar({
      preset,
      configFile,
      cwd,
      dev,
      sandbox
    }).run(phase)

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
