const {resolve, join} = require('path')

const {error} = require('./error')

const CAVIAR_CONFIG = 'caviar.config'

const MAIN_OPTIONS = {
  preset: {
    optional: true,
    description: 'the caviar preset to be used',
    type: 'string'
  },

  configFile: {
    optional: true,
    description: 'the config filepath to be used',
    type: 'string'
  },

  sandbox: {
    default: false,
    description: 'whether to use caviar sandbox or not',
    type: 'boolean'
  },

  dev: {
    default: false,
    description: 'whether to run in dev mode or not',
    type: 'boolean'
  }
}

const MAIN_PROPERTIES = Object.keys(MAIN_OPTIONS)

const assign = (target, source) => {
  for (const key of MAIN_PROPERTIES) {
    if (key in source) {
      target[key] = source[key]
    }
  }
}

const isMainDefined = parent => parent.preset || parent.configFile

const DEFAULT_OPTIONS = {
  cwd: {
    default () {
      return process.cwd()
    },
    description: 'set the current working directory, defaults to `process.cwd()`',
    set (cwd) {
      return resolve(cwd)
    }
  },

  ...MAIN_OPTIONS,

  phase: {
    default: 'default',
    description: 'the caviar phase to run',
    type: 'string'
  },

  profile: {
    optional: true,
    description: 'specify which config profile to use, defining this property requires the "multi" field in caviar.config',
    type: 'string',
    default () {
      return this.rawParent._[0] || ''
    },
    set (profile) {
      if (profile && isMainDefined(this.parent)) {
        throw error('OPTION_CONFLICT')
      }

      return profile
    }
  },
}

const createOptions = ({
  defaultCaviarConfig
} = {}) => ({
  ...DEFAULT_OPTIONS,
  [CAVIAR_CONFIG]: {
    default () {
      return defaultCaviarConfig || join(this.parent.cwd, 'caviar.config.js')
    },
    set (path) {
      if (isMainDefined(this.parent)) {
        return
      }

      let caviarConfig

      try {
        caviarConfig = require(path)
      } catch (err) {
        throw error('ERR_LOAD_CAVIAR_CONFIG', path, err.stack)
      }

      const {
        profile,
        phase
      } = this.parent

      if (profile) {
        if (!caviarConfig.multi) {
          throw error('NO_MULTI', path)
        }

        caviarConfig = caviarConfig.multi[profile]

        if (!caviarConfig) {
          throw error('DIRECTIVE_NOT_FOUND', profile, path)
        }
      }

      assign(this.parent, caviarConfig)

      const phaseConfig = caviarConfig.phases && caviarConfig.phases[phase]

      if (phaseConfig) {
        assign(this.parent, phaseConfig)
      }
    }
  }
})

module.exports = {
  createOptions
}
