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

module.exports = {
  error
}
