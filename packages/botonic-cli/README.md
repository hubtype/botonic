@botonic/cli
=================

@botonic/cli is the tool that allows you to create and deploy bots to Hubtype.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@botonic/cli.svg)](https://npmjs.org/package/@botonic/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@botonic/cli.svg)](https://npmjs.org/package/@botonic/cli)


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
$ botonic (--version)
@botonic/cli/0.40.0 darwin-arm64 node-v22.19.0
$ botonic --help [COMMAND]
USAGE
  $ botonic COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`botonic deploy [PROVIDER]`](#botonic-deploy-provider)
* [`botonic help [COMMAND]`](#botonic-help-command)
* [`botonic login`](#botonic-login)
* [`botonic logout`](#botonic-logout)
* [`botonic new NAME [PROJECTNAME]`](#botonic-new-name-projectname)
* [`botonic plugins`](#botonic-plugins)
* [`botonic plugins:add PLUGIN`](#botonic-pluginsadd-plugin)
* [`botonic plugins:inspect PLUGIN...`](#botonic-pluginsinspect-plugin)
* [`botonic plugins:install PLUGIN`](#botonic-pluginsinstall-plugin)
* [`botonic plugins:link PATH`](#botonic-pluginslink-path)
* [`botonic plugins:remove [PLUGIN]`](#botonic-pluginsremove-plugin)
* [`botonic plugins:reset`](#botonic-pluginsreset)
* [`botonic plugins:uninstall [PLUGIN]`](#botonic-pluginsuninstall-plugin)
* [`botonic plugins:unlink [PLUGIN]`](#botonic-pluginsunlink-plugin)
* [`botonic plugins:update`](#botonic-pluginsupdate)
* [`botonic serve`](#botonic-serve)

## `botonic deploy [PROVIDER]`

Deploy Botonic project to cloud provider

```
USAGE
  $ botonic deploy [PROVIDER] [-c <value>] [-e <value>] [-p <value>] [-b <value>]

ARGUMENTS
  PROVIDER  (hubtype) Provider to deploy to

FLAGS
  -b, --botName=<value>   Name of the bot from Hubtype where you want to deploy
  -c, --command=<value>   Command to execute from the package "scripts" object
  -e, --email=<value>     Email from Hubtype Organization
  -p, --password=<value>  Password from Hubtype Organization

DESCRIPTION
  Deploy Botonic project to cloud provider

EXAMPLES
  $ botonic deploy
  Building...
  Creating bundle...
  Uploading...
  🚀 Bot deployed!
```

_See code: [src/commands/deploy.ts](https://github.com/hubtype/botonic/blob/v0.40.0/src/commands/deploy.ts)_

## `botonic help [COMMAND]`

Display help for botonic.

```
USAGE
  $ botonic help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for botonic.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.33/src/commands/help.ts)_

## `botonic login`

Log in to Botonic

```
USAGE
  $ botonic login [-p <value>]

FLAGS
  -p, --path=<value>  Path to botonic project. Defaults to current dir.

DESCRIPTION
  Log in to Botonic
```

_See code: [src/commands/login.ts](https://github.com/hubtype/botonic/blob/v0.40.0/src/commands/login.ts)_

## `botonic logout`

Log out of Botonic

```
USAGE
  $ botonic logout [-p <value>]

FLAGS
  -p, --path=<value>  Path to botonic project. Defaults to current dir.

DESCRIPTION
  Log out of Botonic
```

_See code: [src/commands/logout.ts](https://github.com/hubtype/botonic/blob/v0.40.0/src/commands/logout.ts)_

## `botonic new NAME [PROJECTNAME]`

Create a new Botonic project

```
USAGE
  $ botonic new NAME [PROJECTNAME]

ARGUMENTS
  NAME         name of the bot folder
  PROJECTNAME  OPTIONAL name of the bot project

DESCRIPTION
  Create a new Botonic project

EXAMPLES
  $ botonic new test_bot
  Creating...
  ✨ test_bot was successfully created!
```

_See code: [src/commands/new.ts](https://github.com/hubtype/botonic/blob/v0.40.0/src/commands/new.ts)_

## `botonic plugins`

List installed plugins.

```
USAGE
  $ botonic plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ botonic plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.48/src/commands/plugins/index.ts)_

## `botonic plugins:add PLUGIN`

Installs a plugin into botonic.

```
USAGE
  $ botonic plugins:add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into botonic.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the BOTONIC_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the BOTONIC_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ botonic plugins:add

EXAMPLES
  Install a plugin from npm registry.

    $ botonic plugins:add myplugin

  Install a plugin from a github url.

    $ botonic plugins:add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ botonic plugins:add someuser/someplugin
```

## `botonic plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ botonic plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ botonic plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.48/src/commands/plugins/inspect.ts)_

## `botonic plugins:install PLUGIN`

Installs a plugin into botonic.

```
USAGE
  $ botonic plugins:install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into botonic.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the BOTONIC_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the BOTONIC_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ botonic plugins:add

EXAMPLES
  Install a plugin from npm registry.

    $ botonic plugins:install myplugin

  Install a plugin from a github url.

    $ botonic plugins:install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ botonic plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.48/src/commands/plugins/install.ts)_

## `botonic plugins:link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ botonic plugins:link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ botonic plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.48/src/commands/plugins/link.ts)_

## `botonic plugins:remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ botonic plugins:remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ botonic plugins:unlink
  $ botonic plugins:remove

EXAMPLES
  $ botonic plugins:remove myplugin
```

## `botonic plugins:reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ botonic plugins:reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.48/src/commands/plugins/reset.ts)_

## `botonic plugins:uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ botonic plugins:uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ botonic plugins:unlink
  $ botonic plugins:remove

EXAMPLES
  $ botonic plugins:uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.48/src/commands/plugins/uninstall.ts)_

## `botonic plugins:unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ botonic plugins:unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ botonic plugins:unlink
  $ botonic plugins:remove

EXAMPLES
  $ botonic plugins:unlink myplugin
```

## `botonic plugins:update`

Update installed plugins.

```
USAGE
  $ botonic plugins:update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.48/src/commands/plugins/update.ts)_

## `botonic serve`

Serve your bot in your localhost

```
USAGE
  $ botonic serve

DESCRIPTION
  Serve your bot in your localhost

EXAMPLES
  $ botonic serve
  > Project is running at http://localhost:8080/
```

_See code: [src/commands/serve.ts](https://github.com/hubtype/botonic/blob/v0.40.0/src/commands/serve.ts)_
<!-- commandsstop -->
