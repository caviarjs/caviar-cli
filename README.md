[![Build Status](https://travis-ci.org/caviarjs/caviar-cli.svg?branch=master)](https://travis-ci.org/caviarjs/caviar-cli)
[![Coverage](https://codecov.io/gh/caviarjs/caviar-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/caviarjs/caviar-cli)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/caviarjs/caviar-cli?branch=master&svg=true)](https://ci.appveyor.com/project/caviarjs/caviar-cli)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/@caviar/cli.svg)](http://badge.fury.io/js/@caviar/cli)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/@caviar/cli.svg)](https://www.npmjs.org/package/@caviar/cli)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/caviarjs/caviar-cli.svg)](https://david-dm.org/caviarjs/caviar-cli)
-->

# @caviar/cli

Caviar cli tool

## Install

```sh
$ npm i -g @caviar/cli
```

## Usage

```sh
> caviar --preset /path/to/preset.js --configFile /path/to/config.js
```

**CLI options**

Options  |  required | default value | type | description
---- | ---- | ---- | ---- | ----
**--cwd** | NO | `process.cwd()` | path | specify the working directory
**--dev**, **--no-dev** | NO | `false` | boolean | whether in dev mode
**--sandbox**, **--no-sandbox** | NO | `false` | boolean | whether use sandbox or not
**--phase** | NO | `'default'` | string | what kind of phase should caviar run as
**--preset** | Depends | - | path | the javascript file path of the caviar preset
**--configFile** | Depends | - | path | the javascript file path of the caviar config

At least one of `preset` and `configFile` should be specified.

## Use `caviar.config.js` to simply the cli options

If a `--caviar.config` option has been specified,

caviar.config.js

```js
module.exports = {
  preset: '@my/caviar-layer',
  configFile: require.resolve('./config')
}
```

```sh
> caviar
```

For details,

```sh
> caviar --help
```

## Create your own caviar cli with default profile settings

bin.js

```js
#!/usr/bin/env node

const {Command} = require('@caviar/cli')

new Command({
  defaultCaviarConfig: '/path/to/default/caviar.config.js'
}).start()
```

## License

[MIT](LICENSE)
