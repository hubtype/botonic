import { Command } from '@oclif/command'
import { exec as childProcessExec } from 'child_process'
import colors from 'colors'
import fetchRepoDir from 'fetch-repo-dir'
import { existsSync } from 'fs'
import { moveSync } from 'fs-extra'
import { prompt, Separator } from 'inquirer'
import ora from 'ora'
import { join } from 'path'
import rimraf from 'rimraf'
import { promisify } from 'util'

import { BotonicAPIService } from '../botonic-api-service'
import { EXAMPLES, TEMPLATES } from '../botonic-projects'
import { track } from '../utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = promisify(childProcessExec)

export default class Run extends Command {
  static description = 'Create a new Botonic project'

  static examples = [
    `$ botonic new test_bot
Creating...
✨ test_bot was successfully created!
`,
  ]

  static args = [
    { name: 'name', description: 'name of the bot folder', required: true },
    {
      name: 'projectName',
      description: 'OPTIONAL name of the bot project',
      required: false,
    },
  ]

  private templates = TEMPLATES

  private examples = EXAMPLES

  private allProjects = [...this.templates, ...this.examples]

  private botonicApiService = new BotonicAPIService()

  async run(): Promise<void> {
    track('Created Botonic Bot CLI')
    const { args } = this.parse(Run)
    const userProjectName = args.name
    let selectedProjectName = ''
    if (!args.projectName) {
      await this.selectBotName().then(resp => {
        selectedProjectName = this.allProjects.filter(
          p => p.description === resp.botName
        )[0].name
        return
      })
    } else {
      const botExists = this.allProjects.filter(
        p => p.name === args.projectName
      )
      if (botExists.length) {
        selectedProjectName = args.projectName
      } else {
        const projectNames = this.allProjects.map(p => p.name)
        console.log(
          colors.red(
            `Template ${args.projectName} does not exist, please choose one of ${projectNames}.`
          )
        )
        return
      }
    }

    if (existsSync(userProjectName)) {
      rimraf.sync(userProjectName)
    }

    let spinner = ora({
      text: 'Downloading files...',
      spinner: 'bouncingBar',
    }).start()

    const selectedProject = this.allProjects.filter(
      project => project.name === selectedProjectName
    )[0]

    try {
      await fetchRepoDir({
        src: selectedProject.uri,
        dir: userProjectName,
      })
    } catch (e) {
      throw new Error(`Error downloading ${selectedProjectName}: ${String(e)}`)
    }
    spinner.succeed()
    process.chdir(args.name)
    spinner = ora({
      text: 'Installing dependencies...',
      spinner: 'bouncingBar',
    }).start()
    const dependencyCommand = `npm install`
    await exec(dependencyCommand)
    spinner.succeed()
    await this.botonicApiService.buildIfChanged(false)
    this.botonicApiService.beforeExit()
    moveSync(join('..', '.botonic.json'), join(process.cwd(), '.botonic.json'))
    const chdirCmd = colors.bold(`cd ${args.name}`)
    const runCmd = colors.bold('botonic serve')
    const deployCmd = colors.bold('botonic deploy')
    console.log(
      `\n✨  Bot ${colors.bold(
        args.name
      )} was successfully created!\n\nNext steps:\n${chdirCmd}\n${runCmd} (test your bot locally from the browser)\n${deployCmd} (publish your bot to the world!)`
    )
  }

  selectBotName(): Promise<{ botName: string }> {
    return prompt([
      {
        type: 'list',
        name: 'botName',
        message: 'Select a bot template',
        choices: [
          new Separator('----- Templates -----'),
          ...this.templates.map(p => p.description),
          new Separator('----- Examples -----'),
          ...this.examples.map(p => p.description),
        ],
      },
    ])
  }
}
