botonic
=======

Build chatbots using React

[![Version](https://img.shields.io/npm/v/botonic.svg)](https://npmjs.org/package/botonic)
[![CircleCI](https://circleci.com/gh/ericmarcos/botonic/tree/master.svg?style=shield)](https://circleci.com/gh/ericmarcos/botonic/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/ericmarcos/botonic?branch=master&svg=true)](https://ci.appveyor.com/project/ericmarcos/botonic/branch/master)
[![Codecov](https://codecov.io/gh/ericmarcos/botonic/branch/master/graph/badge.svg)](https://codecov.io/gh/ericmarcos/botonic)
[![Downloads/week](https://img.shields.io/npm/dw/botonic.svg)](https://npmjs.org/package/botonic)
[![License](https://img.shields.io/npm/l/botonic.svg)](https://github.com/ericmarcos/botonic/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g botonic
$ botonic COMMAND
running command...
$ botonic (-v|--version|version)
botonic/0.0.0 darwin-x64 node-v9.9.0
$ botonic --help [COMMAND]
USAGE
  $ botonic COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [botonic hello [FILE]](#botonic-hello-file)
* [botonic help [COMMAND]](#botonic-help-command)

## botonic hello [FILE]

describe the command here

```
USAGE
  $ botonic hello [FILE]

OPTIONS
  -f, --force
  -n, --name=name  name to print

EXAMPLE
  $ botonic hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/hubtype/botonic/blob/v0.0.0/src/commands/hello.ts)_

## botonic help [COMMAND]

display help for botonic

```
USAGE
  $ botonic help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v1.2.1/src/commands/help.ts)_
<!-- commandsstop -->
