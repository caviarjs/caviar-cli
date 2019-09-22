// Working modes
// - installed as local dep
// - installed globally

const {join} = require('path')
const isPathInside = require('is-path-inside')
const resolveFrom = require('resolve-from')
const semver = require('semver')

const {error} = require('./error')

const MIN_CAVIAR_VERSION = '5.0.0'

let moduleName = 'caviar'

class WorkingMode {
  static set moduleName (name) {
    moduleName = name
  }

  constructor (cwd) {
    this._cwd = cwd
    this._isLocal = isPathInside(__dirname, join(cwd, 'node_modules'))
    this._checkConflict()

    this._caviar = require(this.resolve(moduleName))

    const {version} = this._caviar

    if (semver.lt(version, MIN_CAVIAR_VERSION)) {
      throw error('INCOMPATIBLE_CAVIAR_VERSION', version)
    }
  }

  get local () {
    return this._isLocal
  }

  get caviar () {
    return this._caviar
  }

  _checkConflict () {
    if (this._isLocal) {
      return
    }

    try {
      resolveFrom('caviar', this._cwd)
    } catch (err) {
      return
    }

    throw error('GLOBAL_CAVIAR_CONFLICT', this._cwd)
  }

  resolve (id) {
    const from = this._isLocal
      ? this._cwd
      : __dirname

    try {
      return resolveFrom(from, id)
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
