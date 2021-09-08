#!/usr/bin/env node

// Usage:
// `$ yarn create botonic-app ./path/to/new-project`

// eslint-disable-next-line node/shebang
import chalk from 'chalk'
import checkNodeVersion from 'check-node-version'
import execa from 'execa'
import fs from 'fs-extra'
import Listr from 'listr'
import path from 'path'
import yargs from 'yargs'

import { name, version } from '../package.json'

const style = {
  error: chalk.bold.red,
  warning: chalk.keyword('orange'),
  success: chalk.greenBright,
  info: chalk.grey,

  header: chalk.bold.underline.hex('#e8e8e8'),
  cmd: chalk.hex('#808080'),
  botonic: chalk.hex('#5c85ff'),
  love: chalk.redBright,

  green: chalk.green,
}

const { _: args, 'yarn-install': yarnInstall, typescript } = yargs
  .scriptName(name)
  .usage('Usage: $0 <project directory> [option]')
  .example('$0 newapp')
  .option('yarn-install', {
    default: true,
    type: 'boolean',
    describe: 'Skip yarn install with --no-yarn-install',
  })
  .version(version)
  .strict().argv

const targetDir = String(args).replace(/,/g, '-')
if (!targetDir) {
  console.error('Please specify the project directory')
  console.log(
    `  ${chalk.cyan('yarn create botonic-app')} ${chalk.green(
      '<project-directory>'
    )}`
  )
  console.log()
  console.log('For example:')
  console.log(
    `  ${chalk.cyan('yarn create botonic-app')} ${chalk.green(
      'my-botonic-app'
    )}`
  )
  process.exit(1)
}

const newAppDir = path.resolve(process.cwd(), targetDir)
const appDirExists = fs.existsSync(newAppDir)
const templateDir = path.resolve(__dirname, '../template')
const devTemplateDir = path.resolve(__dirname, '../dev-template')

const createProjectTasks = ({ newAppDir }) => {
  return [
    {
      title: `${appDirExists ? 'Using' : 'Creating'} directory '${newAppDir}'`,
      task: () => {
        if (appDirExists) {
          // make sure that the target directory is empty
          if (fs.readdirSync(newAppDir).length > 0) {
            console.error(`'${newAppDir}' already exists and is not empty.`)
            process.exit(1)
          }
        } else {
          fs.ensureDirSync(path.dirname(newAppDir))
        }
        fs.copySync(devTemplateDir, newAppDir)
      },
    },
  ]
}

const installNodeModulesTasks = ({ newAppDir }) => {
  return [
    {
      title: 'Checking node and yarn compatibility',
      task: () => {
        return new Promise((resolve, reject) => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { engines } = require(path.join(newAppDir, 'package.json'))

          checkNodeVersion(engines, (_error, result) => {
            if (result.isSatisfied) {
              return resolve()
            }

            const errors = Object.keys(result.versions).map(name => {
              const { version, wanted } = result.versions[name]
              return `${name} ${wanted} required, but you have ${version}.`
            })
            return reject(new Error(errors.join('\n')))
          })
        })
      },
    },
    {
      title: "Running 'yarn install'... (This could take a while)",
      skip: () => {
        if (yarnInstall === false) {
          return 'skipped on request'
        }
      },
      task: () => {
        return execa('yarn install', {
          shell: true,
          cwd: newAppDir,
        })
      },
    },
  ]
}

new Listr(
  [
    {
      title: 'Creating Botonic app',
      task: () => new Listr(createProjectTasks({ newAppDir })),
    },
    {
      title: 'Installing packages',
      task: () => new Listr(installNodeModulesTasks({ newAppDir })),
    },
  ],
  { collapse: false, exitOnError: true }
)
  .run()
  // eslint-disable-next-line promise/always-return
  .then(() => {
    // zOMG the semicolon below is a real Prettier thing. What??
    // https://prettier.io/docs/en/rationale.html#semicolons
    ;[
      '',
      style.success('Thanks for trying out Botonic!'),
      '',
      ` ⚡️ ${style.botonic(
        'Get up and running fast with this Quick Start guide'
      )}: https://botonic.io/docs/getting-started`,
      '',
      style.header('Join the Community'),
      '',
      `${style.botonic(' ❖ Join our Chat')}: https://slack.botonic.io`,
      '',
      style.header('Get some help'),
      '',
      `${style.botonic(
        ' ❖ Get started with the Tutorial'
      )}: https://botonic.io/docs/create-convapp`,
      `${style.botonic(' ❖ Read the Documentation')}: https://botonic.io/docs`,
      '',
      `${style.botonic(
        ' ❖ Follow us on Twitter'
      )}: https://twitter.com/botonic_`,
      '',
      `${style.header(`Become a Contributor`)} ${style.love('❤')}`,
      '',
      `${style.botonic(
        ' ❖ Learn how to get started'
      )}: https://github.com/hubtype/botonic/blob/master/CONTRIBUTING.md`,
      `${style.botonic(
        ' ❖ Find a Good First Issue'
      )}: https://github.com/hubtype/botonic/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`,
      '',
      `${style.header(`Fire it up!`)} 🚀`,
      '',
      `${style.botonic(` > ${style.green(`cd ${targetDir}`)}`)}`,
      `${style.botonic(` > ${style.green(`yarn serve`)}`)}`,
      '',
    ].map(item => console.log(item))
  })
  .catch(e => {
    console.log()
    console.log(e)
    process.exit(1)
  })
