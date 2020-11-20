# @botonic/cli

Build Chatbots Using React

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@botonic/cli.svg)](https://npmjs.org/package/@botonic/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@botonic/cli.svg)](https://npmjs.org/package/@botonic/cli)
[![License](https://img.shields.io/npm/l/@botonic/cli.svg)](https://github.com/hubtype/botonic/blob/master/package.json)

<!-- toc -->
* [@botonic/cli](#botoniccli)
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
@botonic/cli/0.16.0 darwin-x64 node-v10.23.0
$ botonic --help [COMMAND]
USAGE
  $ botonic COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`botonic deploy [BOT_NAME]`](#botonic-deploy-bot_name)
* [`botonic help [COMMAND]`](#botonic-help-command)
* [`botonic login`](#botonic-login)
* [`botonic logout`](#botonic-logout)
* [`botonic new NAME [TEMPLATENAME]`](#botonic-new-name-templatename)
* [`botonic serve`](#botonic-serve)
* [`botonic test`](#botonic-test)
* [`botonic train`](#botonic-train)

## `botonic deploy [BOT_NAME]`

```
USAGE
  $ botonic deploy [BOT_NAME]

OPTIONS
  -b, --botName=botName    Name of the bot from Hubtype where you want to deploy
  -c, --command=command    Command to execute from the package "scripts" object
  -e, --email=email        Email from Hubtype Organization
  -f, --force              Force deploy despite of no changes. Disabled by default
  -p, --password=password  Password from Hubtype Organization

EXAMPLE
  $ botonic deploy
  Building...
  Creating bundle...
  Uploading...
  🚀 Bot deployed!
```

_See code: [lib/commands/deploy.js](https://github.com/hubtype/botonic/blob/v0.16.0/lib/commands/deploy.js)_

## `botonic help [COMMAND]`

```
USAGE
  $ botonic help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `botonic login`

```
USAGE
  $ botonic login

OPTIONS
  -p, --path=path  Path to botonic project. Defaults to current dir.
```

_See code: [lib/commands/login.js](https://github.com/hubtype/botonic/blob/v0.16.0/lib/commands/login.js)_

## `botonic logout`

```
USAGE
  $ botonic logout

OPTIONS
  -p, --path=path  Path to botonic project. Defaults to current dir.
```

_See code: [lib/commands/logout.js](https://github.com/hubtype/botonic/blob/v0.16.0/lib/commands/logout.js)_

## `botonic new NAME [TEMPLATENAME]`

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

_See code: [lib/commands/new.js](https://github.com/hubtype/botonic/blob/v0.16.0/lib/commands/new.js)_

## `botonic serve`

```
USAGE
  $ botonic serve

EXAMPLE
  $ botonic serve
  > Project is running at http://localhost:8080/
```

_See code: [lib/commands/serve.js](https://github.com/hubtype/botonic/blob/v0.16.0/lib/commands/serve.js)_

## `botonic test`

```
USAGE
  $ botonic test

EXAMPLE
  PASS  tests/app.test.js
     ✓ TEST: hi.js (10ms)
     ✓ TEST: pizza.js (1ms)
     ✓ TEST: sausage.js (1ms)
     ✓ TEST: bacon.js
     ✓ TEST: pasta.js (1ms)
     ✓ TEST: cheese.js (1ms)
     ✓ TEST: tomato.js

  Test Suites: 1 passed, 1 total
  Tests:       7 passed, 7 total
  Snapshots:   0 total
  Time:        1.223s
  Ran all test suites.
```

_See code: [lib/commands/test.js](https://github.com/hubtype/botonic/blob/v0.16.0/lib/commands/test.js)_

## `botonic train`

```
USAGE
  $ botonic train

OPTIONS
  --lang=lang

EXAMPLE
  $ botonic train
       TRAINING MODEL FOR {LANGUAGE}...
```

_See code: [lib/commands/train.js](https://github.com/hubtype/botonic/blob/v0.16.0/lib/commands/train.js)_
<!-- commandsstop -->
