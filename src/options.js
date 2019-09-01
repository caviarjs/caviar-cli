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

  phase: {
    default: 'default',
    description: 'the caviar phase to run, defaults to "default"',
    type: 'string'
  },

  ...MAIN_OPTIONS,

  profile: {
    optional: true,
    description: 'specify which config profile to use, defining this property requires the "multi" field in caviar.config',
    type: 'string',
    default () {
      return this.rawParent._[0] || ''
    }
  },
}

const createOptions = ({
  defaultCaviarConfig
} = {}) => ({
  ...DEFAULT_OPTIONS,
  [CAVIAR_CONFIG]: {
    description: 'specify the cli configuration file to use',
    default () {
      if (defaultCaviarConfig) {
        return defaultCaviarConfig
      }

      // We also support caviar.config directory
      const path = join(this.parent.cwd, 'caviar.config')

      try {
        return require.resolve(path)
      } catch (err) {
        // do nothing
      }
    },
    set (path) {
      // If no caviar.config found, then skip
      if (!path) {
        if (!isMainDefined(this.parent)) {
          throw error('DEFAULT_CONFIG_NOT_FOUND', this.parent.cwd)
        }

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
          throw error('PROFILE_NOT_FOUND', profile, path)
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

// const usage = `caviar [options]`

const optionGroups = [
  {
    title: 'Main Options:',
    options: MAIN_PROPERTIES
  },

  {
    title: 'Profile Options:',
    options: [
      'profile',
      'caviar.config'
    ]
  }
]

module.exports = {
  createOptions,
  optionGroups
}
