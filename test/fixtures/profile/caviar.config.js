const defaults = {
  preset: 'foo',
  configFile: 'bar.js',
  dev: true,
  sandbox: true,
}

module.exports = {
  ...defaults,

  profiles: {
    foo: {
      ...defaults,
      dev: false,
      phases: {
        build: {
          sandbox: false
        },

        conflict: {
          phase: 'conflict'
        }
      }
    }
  },
  phases: {
    build: {
      dev: false
    }
  }
}
