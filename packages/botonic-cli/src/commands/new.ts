import { Command } from '@oclif/command'
import { exec as childProcessExec } from 'child_process'
import { bold, red } from 'colors'
import fetchRepoDir from 'fetch-repo-dir'
import { existsSync } from 'fs'
import { moveSync } from 'fs-extra'
import { prompt } from 'inquirer'
import ora from 'ora'
import { join } from 'path'
import rimraf from 'rimraf'
import { promisify } from 'util'

import { BotonicAPIService } from '../botonic-api-service'
import { BotonicProject, EXAMPLES } from '../botonic-examples'
import { track, trackError } from '../utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = promisify(childProcessExec)

interface NewCommandArgs {
  name: string
  projectName?: string
}

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

  private examples = EXAMPLES

  private botonicApiService = new BotonicAPIService()

  async run(): Promise<void> {
    track('Created Botonic Bot CLI')
    try {
      const args = this.parse(Run).args as NewCommandArgs
      const selectedProjectName = args.projectName
      const userProjectDirName = args.name

      const selectedProject = await this.resolveSelectedProject(
        selectedProjectName
      )
      if (!selectedProject) {
        console.log(
          red(
            `Example ${selectedProjectName} does not exist, please choose one of the following:\n` +
              `${this.examples.map(p => p.name).join(', ')}`
          )
        )
        return
      }
      track('Created Botonic Bot CLI', {
        selected_project_name: selectedProjectName,
      })
      await this.downloadSelectedProjectIntoPath(
        selectedProject,
        userProjectDirName
      )
      await this.installProjectDependencies(userProjectDirName)
      this.botonicApiService.beforeExit()
      moveSync(
        join('..', '.botonic.json'),
        join(process.cwd(), '.botonic.json')
      )
      this.showFeedback(selectedProject, userProjectDirName)
    } catch (e) {
      const error = `botonic new error: ${String(e)}`
      trackError(error)
      throw new Error(error)
    }
  }

  selectBotName(): Promise<{ botName: string }> {
    return prompt([
      {
        type: 'list',
        name: 'botName',
        message: 'Select a bot example',
        choices: this.examples.map(p => p.description),
      },
    ])
  }

  async resolveSelectedProject(
    projectName: string | undefined
  ): Promise<BotonicProject | undefined> {
    if (!projectName)
      return await this.selectBotName().then(userInput =>
        this.examples.find(p => p.description === userInput.botName)
      )
    return this.examples.find(p => p.name === projectName)
  }

  async downloadSelectedProjectIntoPath(
    selectedProject: BotonicProject,
    path: string
  ): Promise<void> {
    if (existsSync(path)) rimraf.sync(path)
    const spinner = ora({
      text: 'Downloading files...',
      spinner: 'bouncingBar',
    }).start()
    try {
      await fetchRepoDir({
        src: selectedProject.uri,
        dir: path,
      })
      spinner.succeed()
    } catch (e) {
      spinner.fail()
      const error = `Downloading Project: ${selectedProject.name}: ${String(e)}`
      trackError(error)
      throw new Error(error)
    }
  }

  async installProjectDependencies(path: string): Promise<void> {
    process.chdir(path)
    const spinner = ora({
      text: 'Installing dependencies...',
      spinner: 'bouncingBar',
    }).start()
    try {
      await exec('npm install')
      spinner.succeed()
    } catch (e) {
      spinner.fail()
      const error = `Installing dependencies: ${String(e)}`
      trackError(error)
      throw new Error(error)
    }
  }

  showFeedback(selectedProject: BotonicProject, path: string): void {
    const chdirCmd = bold(`cd ${path}`)
    const trainCmd =
      selectedProject.name === 'nlu' ? bold(`botonic train`) : undefined
    const serveCmd = `${bold(
      'botonic serve'
    )} (test your bot locally from the browser)`
    const deployCmd = `${bold(
      'botonic deploy'
    )} (publish your bot to the world!)`
    const successText = `\n✨  Bot ${bold(path)} was successfully created!\n`
    console.log(successText)
    console.log('Next steps:')
    console.log(chdirCmd)
    console.log(serveCmd)
    trainCmd && console.log(trainCmd)
    console.log(deployCmd)
  }
}
