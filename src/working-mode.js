// Working modes
// - installed as local dep
// - installed globally

const {join} = require('path')
const isPathInside = require('is-path-inside')
const resolveFrom = require('resolve-from')
const semver = require('semver')

const {error} = require('./error')

const MIN_CAVIAR_VERSION = '5.0.0'

class WorkingMode {
  constructor (cwd) {
    this._cwd = cwd
    this._isLocal = isPathInside(__dirname, join(cwd, 'node_modules'))

    this._caviar = require(this.resolve('caviar'))

    const {version} = this._caviar

    if (semver.lt(version, MIN_CAVIAR_VERSION)) {
      throw error('INCOMPATIBLE_CAVIAR_VERSION', version)
    }
  }

  get caviar () {
    return this._caviar
  }

  resolve (id, from) {
    try {
      return resolveFrom(id, from || __dirname)
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        const e = this._isLocal
          ? error('LOCAL_MODULE_NOT_FOUND', id, id)
          : error('GLOBAL_MODULE_NOT_FOUND', id, id)

        throw e
      }

      throw err
    }
  }
}

module.exports = {
  WorkingMode
}
