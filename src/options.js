const {resolve, join} = require('path')
// const {set} = require('bin-tool')

const {error} = require('./error')

const CAVIAR_CONFIG = 'caviar.config'
const PRINT_OPTIONS = 'print-options'

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

  profile: {
    default: '',
    description: 'specify which config profile to use, defining this property requires the "profiles" field in caviar.config',
    type: 'string'
  },

  [PRINT_OPTIONS]: {
    default: true,
    description: 'whether print the options, defaults to true',
    type: 'boolean'
  }
}

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
  },

  phase: {
    default: 'default',
    description: 'the caviar phase to run, defaults to "default"',
    type: 'string'
  }
}

const MAIN_PROPERTIES = Object.keys(MAIN_OPTIONS)

const assign = async (target, source) => {
  for (const key of MAIN_PROPERTIES) {
    if (key in source) {
      target[key] = source[key]
    }
  }
}

const isMainDefined = parent => parent.preset || parent.configFile

// Logic:
// - has profile:
// Object.assign(
//   {},
//   config.profiles[profile]
//   config.profiles[profile].phases[phase]
// )
// - no profile:
// Object.assign(
//   {},
//   config
//   config.phases[phase]
// )
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
    async set (path) {
      // If no caviar.config found, then skip
      if (!path) {
        if (this.parent.profile || !isMainDefined(this.rawParent)) {
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
        profile
      } = this.parent

      const {
        phase
      } = this.rawParent

      if (profile) {
        if (!caviarConfig.profiles) {
          throw error('NO_PROFILES', path)
        }

        caviarConfig = caviarConfig.profiles[profile]

        if (!caviarConfig) {
          throw error('PROFILE_NOT_FOUND', profile, path)
        }
      }

      assign(this.rawParent, caviarConfig)

      const phaseConfig = caviarConfig.phases && caviarConfig.phases[phase]

      if (!phaseConfig) {
        return
      }

      if ('phase' in phaseConfig) {
        throw new Error('PHASE_CONFLICT', phaseConfig[phase], path)
      }

      assign(this.rawParent, phaseConfig)
    }
  },
  ...MAIN_OPTIONS
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
  optionGroups,
  PRINT_OPTIONS
}
