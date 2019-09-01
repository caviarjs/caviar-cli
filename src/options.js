const {resolve} = require('path')

const CAVIAR_CONFIG = 'caviar.config'

module.exports = {
  cwd: {
    default () {
      return process.cwd()
    },

    set (cwd) {
      return resolve(cwd)
    }
  },

  preset: {
    type: 'string'
  },

  configFile: {
    type: 'string'
  },

  sandbox: {

  },

  [CAVIAR_CONFIG]: {
  }
}
