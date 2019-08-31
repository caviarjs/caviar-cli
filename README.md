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

## License

[MIT](LICENSE)
