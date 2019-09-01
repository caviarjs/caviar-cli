const {Command} = require('bin-tool')

const {createOptions} = require('./options')
const WorkingMode = require('./working-mode')

module.exports = class CaviarCommand extends Command {
  constructor ({
    defaultCaviarConfig
  } = {}) {
    super()

    this.options = createOptions({
      defaultCaviarConfig
    })
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

      await subprocess.ready()
      monitor(subprocess).catch(err => {
        console.error(err.stack)
        process.exit(1)
      })
    }
  }
}
