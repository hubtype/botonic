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
@botonic/cli/0.7.0 darwin-x64 node-v10.15.0
$ botonic --help [COMMAND]
USAGE
  $ botonic COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`botonic deploy [BOT_NAME]`](#botonic-deploy-bot-name)
* [`botonic help [COMMAND]`](#botonic-help-command)
* [`botonic login`](#botonic-login)
* [`botonic logout`](#botonic-logout)
* [`botonic new NAME [TEMPLATENAME]`](#botonic-new-name-templatename)
* [`botonic serve`](#botonic-serve)

## `botonic deploy [BOT_NAME]`

Deploy Botonic project to hubtype.com

```
USAGE
  $ botonic deploy [BOT_NAME]

OPTIONS
  -f, --force  Force deploy despite of no changes. Disabled by default

EXAMPLE
  $ botonic deploy
  Building...
  Creating bundle...
  Uploading...
  🚀 Bot deployed!
```

_See code: [src/commands/deploy.ts](https://github.com/hubtype/botonic/blob/v0.7.0/src/commands/deploy.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_

## `botonic login`

Log in to Botonic

```
USAGE
  $ botonic login

OPTIONS
  -p, --path=path  Path to botonic project. Defaults to current dir.
```

_See code: [src/commands/login.ts](https://github.com/hubtype/botonic/blob/v0.7.0/src/commands/login.ts)_

## `botonic logout`

Log out of Botonic

```
USAGE
  $ botonic logout

OPTIONS
  -p, --path=path  Path to botonic project. Defaults to current dir.
```

_See code: [src/commands/logout.ts](https://github.com/hubtype/botonic/blob/v0.7.0/src/commands/logout.ts)_

## `botonic new NAME [TEMPLATENAME]`

Create a new Botonic project

```
USAGE
  $ botonic new NAME [TEMPLATENAME]

ARGUMENTS
  NAME          name of the bot folder
  TEMPLATENAME  OPTIONAL name of the bot template

EXAMPLE
  $ botonic new test_bot
  Creating...
  ✨ test_bot was successfully created!
```

_See code: [src/commands/new.ts](https://github.com/hubtype/botonic/blob/v0.7.0/src/commands/new.ts)_

## `botonic serve`

Serve your bot in your localhost

```
USAGE
  $ botonic serve

EXAMPLE
  $ botonic serve
  > Project is running at http://localhost:8080/
```

_See code: [src/commands/serve.ts](https://github.com/hubtype/botonic/blob/v0.7.0/src/commands/serve.ts)_
<!-- commandsstop -->
