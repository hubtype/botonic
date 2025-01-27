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
@botonic/cli/0.31.0 darwin-arm64 node-v20.11.1
$ botonic --help [COMMAND]
USAGE
  $ botonic COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`botonic deploy [PROVIDER]`](#botonic-deploy-provider)
* [`botonic destroy [PROVIDER]`](#botonic-destroy-provider)
* [`botonic help [COMMAND]`](#botonic-help-command)
* [`botonic login`](#botonic-login)
* [`botonic logout`](#botonic-logout)
* [`botonic new NAME [PROJECTNAME]`](#botonic-new-name-projectname)
* [`botonic serve`](#botonic-serve)
* [`botonic test`](#botonic-test)

## `botonic deploy [PROVIDER]`

Deploy Botonic project to cloud provider

```
USAGE
  $ botonic deploy [PROVIDER]

OPTIONS
  -b, --botName=botName    Name of the bot from Hubtype where you want to deploy
  -c, --command=command    Command to execute from the package "scripts" object
  -e, --email=email        Email from Hubtype Organization
  -p, --password=password  Password from Hubtype Organization

EXAMPLES
  $ botonic deploy
  Building...
  Creating bundle...
  Uploading...
  🚀 Bot deployed!

  $ botonic deploy aws
  Deploying to AWS...
```

_See code: [lib/commands/deploy.js](https://github.com/hubtype/botonic/blob/v0.31.0/lib/commands/deploy.js)_

## `botonic destroy [PROVIDER]`

Destroy Botonic project from cloud provider

```
USAGE
  $ botonic destroy [PROVIDER]

EXAMPLE
  $ botonic destroy aws
  Destroying AWS stack...
```

_See code: [lib/commands/destroy.js](https://github.com/hubtype/botonic/blob/v0.31.0/lib/commands/destroy.js)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.18/src/commands/help.ts)_

## `botonic login`

Log in to Botonic

```
USAGE
  $ botonic login

OPTIONS
  -p, --path=path  Path to botonic project. Defaults to current dir.
```

_See code: [lib/commands/login.js](https://github.com/hubtype/botonic/blob/v0.31.0/lib/commands/login.js)_

## `botonic logout`

Log out of Botonic

```
USAGE
  $ botonic logout

OPTIONS
  -p, --path=path  Path to botonic project. Defaults to current dir.
```

_See code: [lib/commands/logout.js](https://github.com/hubtype/botonic/blob/v0.31.0/lib/commands/logout.js)_

## `botonic new NAME [PROJECTNAME]`

Create a new Botonic project

```
USAGE
  $ botonic new NAME [PROJECTNAME]

ARGUMENTS
  NAME         name of the bot folder
  PROJECTNAME  OPTIONAL name of the bot project

EXAMPLE
  $ botonic new test_bot
  Creating...
  ✨ test_bot was successfully created!
```

_See code: [lib/commands/new.js](https://github.com/hubtype/botonic/blob/v0.31.0/lib/commands/new.js)_

## `botonic serve`

Serve your bot in your localhost

```
USAGE
  $ botonic serve

OPTIONS
  -p, --preview  Run preview Botonic 1.0 serve.

EXAMPLE
  $ botonic serve
  > Project is running at http://localhost:8080/
```

_See code: [lib/commands/serve.js](https://github.com/hubtype/botonic/blob/v0.31.0/lib/commands/serve.js)_

## `botonic test`

Test your Botonic components

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

_See code: [lib/commands/test.js](https://github.com/hubtype/botonic/blob/v0.31.0/lib/commands/test.js)_
<!-- commandsstop -->
