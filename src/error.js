const {Errors} = require('err-object')

const {error, E} = new Errors({
  messagePrefix: '[@caviar/cli] '
})

const m = (where, extra = '') => `module "%s" not found.
since you are using @caviar/cli installed ${where}, please install the missing module by

  npm i ${extra}%s
`

E('LOCAL_MODULE_NOT_FOUND', m('locally'))

E('GLOBAL_MODULE_NOT_FOUND', m('globally', '-g '))

E('INCOMPATIBLE_CAVIAR_VERSION',
  'client caviar version is not compatible with the current @caviar/cli, caviar >= 5.0.0 is required')

E('DEFAULT_CONFIG_NOT_FOUND',
  `default caviar.config not found, or you should:
  - specify --caviar.config
  - or put a "caviar.config.js" in "%s"
  - or specify at least one of --preset and --configFile`)

E('ERR_LOAD_CAVIAR_CONFIG',
  'fails to load caviar.config "%s", reason:\n%s')

E('NO_MULTI', 'if --profile is specified, then a "multi" field should be provided in caviar.config "%s"')

E('PROFILE_NOT_FOUND', 'profile "%s" is not found in the "multi" field of caviar.config "%s"')

module.exports = {
  error
}
