import { Command } from '@oclif/command'
import { exec as childProcessExec } from 'child_process'
import { bold, red } from 'colors'
import fetchRepoDir from 'fetch-repo-dir'
import { moveSync } from 'fs-extra'
import { prompt } from 'inquirer'
import ora from 'ora'
import { join } from 'path'
import { promisify } from 'util'

import { Telemetry } from '../analytics/telemetry'
import { BotonicAPIService } from '../botonic-api-service'
import { EXAMPLES } from '../botonic-examples'
import { BotonicProject } from '../interfaces'
import { pathExists, remove } from '../util/file-system'

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
  private telemetry = new Telemetry()

  /* istanbul ignore next */
  async run(): Promise<void> {
    this.telemetry.trackCreated()
    try {
      const args = this.parse(Run).args as NewCommandArgs
      const userProjectDirName = args.name
      const selectedProjectName = args.projectName

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
      this.telemetry.trackCreated({
        selected_project_name: selectedProject.name,
      })
      await this.downloadSelectedProjectIntoPath(
        selectedProject,
        userProjectDirName
      )
      process.chdir(userProjectDirName)
      await this.installDependencies()
      this.botonicApiService.beforeExit()
      moveSync(
        join('..', '.botonic.json'),
        join(process.cwd(), '.botonic.json')
      )
      console.log(this.getProcessFeedback(selectedProject, userProjectDirName))
    } catch (e) {
      const error = `botonic new error: ${String(e)}`
      this.telemetry.trackError(error)
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
    if (pathExists(path)) remove(path)
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
      this.telemetry.trackError(error)
      throw new Error(error)
    }
  }

  async installDependencies(commmand = 'npm install'): Promise<void> {
    const spinner = ora({
      text: 'Installing dependencies...',
      spinner: 'bouncingBar',
    }).start()
    try {
      await exec(commmand)
      spinner.succeed()
    } catch (e) {
      spinner.fail()
      const error = `Installing dependencies: ${String(e)}`
      this.telemetry.trackError(error)
      throw new Error(error)
    }
  }

  /* istanbul ignore next */
  getProcessFeedback(selectedProject: BotonicProject, path: string): string {
    let feedback = `\n✨  Bot ${bold(path)} was successfully created!\n\n`
    feedback += 'Next steps:\n'
    feedback += bold(`cd ${path}\n`)
    feedback += selectedProject.name === 'nlu' ? bold(`botonic train\n`) : ''
    const serveCmd = `${bold(
      'botonic serve'
    )} (test your bot locally from the browser)\n`
    feedback += serveCmd
    const deployCmd = `${bold(
      'botonic deploy'
    )} (publish your bot to the world!)`
    feedback += deployCmd
    return feedback
  }
}
