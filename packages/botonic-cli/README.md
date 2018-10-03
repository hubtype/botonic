@botonic/cli
============

Build Chatbots Using React

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@botonic/cli.svg)](https://npmjs.org/package/@botonic/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@botonic/cli.svg)](https://npmjs.org/package/@botonic/cli)
[![License](https://img.shields.io/npm/l/@botonic/cli.svg)](https://github.com/hubtype/botonic/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @botonic/cli
$ botonic COMMAND
running command...
$ botonic (-v|--version|version)
@botonic/cli/0.5.0 linux-x64 node-v8.12.0
$ botonic --help [COMMAND]
USAGE
  $ botonic COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`botonic hello [FILE]`](#botonic-hello-file)
* [`botonic help [COMMAND]`](#botonic-help-command)

## `botonic hello [FILE]`

describe the command here

```
USAGE
  $ botonic hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ botonic hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/hubtype/botonic/blob/v0.5.0/src/commands/hello.ts)_

## `botonic help [COMMAND]`

display help for botonic

```
USAGE
  $ botonic help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.2/src/commands/help.ts)_
<!-- commandsstop -->
