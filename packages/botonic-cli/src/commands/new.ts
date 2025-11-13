import { select } from '@inquirer/prompts'
import { Args, Command, Flags } from '@oclif/core'
import { exec as childProcessExec } from 'child_process'
import fsExtra from 'fs-extra'
import ora from 'ora'
import { platform } from 'os'
import path from 'path'
import pc from 'picocolors'
import { promisify } from 'util'

import { BotonicAPIService } from '../botonic-api-service.js'
import { EXAMPLES } from '../botonic-examples.js'
import { BotonicProject } from '../interfaces.js'
import {
  downloadSelectedProject,
  editPackageJsonName,
  extractTarGz,
  renameFolder,
} from '../util/download-gzip.js'
import { pathExists, removeRecursively } from '../util/file-system.js'

const exec = promisify(childProcessExec)
export default class New extends Command {
  static override args = {
    name: Args.string({
      description: 'name of the bot folder',
      required: true,
    }),
    projectName: Args.string({
      description: 'OPTIONAL name of the bot project',
      required: false,
    }),
  }
  static override description = 'Create a new Botonic project'
  static override examples = [
    '$ botonic new test_bot\nCreating...\n✨ test_bot was successfully created!',
  ]
  static override flags = {}

  private examples = EXAMPLES

  private botonicApiService = new BotonicAPIService()

  public async run(): Promise<void> {
    try {
      const { args } = await this.parse(New)
      const userProjectDirName = args.name
      const selectedProjectName = args.projectName

      const selectedProject =
        await this.resolveSelectedProject(selectedProjectName)

      if (!selectedProject) {
        console.log(
          pc.red(
            `Example ${String(selectedProjectName)} does not exist, please choose one of the following:\n` +
              `${this.examples.map(p => p.name).join(', ')}`
          )
        )
        return
      }
      await this.downloadSelectedProjectIntoPath(
        selectedProject,
        userProjectDirName
      )
      process.chdir(userProjectDirName)
      const devPlatform = platform()
      if (devPlatform === 'win32') {
        await this.installDependencies()
      } else {
        // TODO: review this when node-sass is needed again
        // Solve issue with node-sass and higher versions of Node.
        // Ref: https://github.com/nodejs/node/issues/38367#issuecomment-1025343439)
        await this.installDependencies('CXXFLAGS="--std=c++14" npm install')
      }
      this.botonicApiService.beforeExit()
      fsExtra.moveSync(
        path.join('..', '.botonic.json'),
        path.join(process.cwd(), '.botonic.json')
      )
      console.log(this.getProcessFeedback(selectedProject, userProjectDirName))
    } catch (e) {
      throw new Error(`botonic new error: ${String(e)}`)
    }
  }

  async resolveSelectedProject(
    projectName: string | undefined
  ): Promise<BotonicProject | undefined> {
    if (!projectName) {
      const botDescription = await select({
        message: 'Select a bot example',
        choices: this.examples.map(p => p.description),
      })
      return this.examples.find(p => p.description === botDescription)
    }
    return this.examples.find(p => p.name === projectName)
  }

  async downloadSelectedProjectIntoPath(
    selectedProject: BotonicProject,
    userProjectDirName: string
  ): Promise<void> {
    if (pathExists(userProjectDirName)) removeRecursively(userProjectDirName)
    const spinnerDownload = ora({
      text: 'Downloading files...',
      spinner: 'bouncingBar',
    }).start()
    try {
      const pathToCreateExample = path.join('.')
      await downloadSelectedProject({
        exampleName: selectedProject.name,
        exampleVersion: selectedProject.version,
      })
      spinnerDownload.succeed()

      const spinnerExtract = ora({
        text: 'Extracting files...',
        spinner: 'bouncingBar',
      }).start()
      await extractTarGz({
        projectPath: pathToCreateExample,
        exampleName: selectedProject.name,
        exampleVersion: selectedProject.version,
      })
      spinnerExtract.succeed()
      await renameFolder(userProjectDirName)
      await editPackageJsonName(pathToCreateExample, userProjectDirName)
    } catch (e) {
      spinnerDownload.fail()
      const error = `Downloading Project: ${selectedProject.name}: ${String(e)}`
      throw new Error(error)
    }
  }

  async installDependencies(command = 'npm install'): Promise<void> {
    const spinner = ora({
      text: 'Installing dependencies...',
      spinner: 'bouncingBar',
    }).start()
    try {
      await exec(command)
      spinner.succeed()
    } catch (e) {
      spinner.fail()
      const error = `Installing dependencies: ${String(e)}`
      throw new Error(error)
    }
  }

  getProcessFeedback(selectedProject: BotonicProject, path: string): string {
    let feedback = `\n✨  Bot ${pc.bold(path)} was successfully created!\n\n`
    feedback += 'Next steps:\n'
    feedback += pc.bold(`cd ${path}\n`)
    feedback += selectedProject.name === 'nlu' ? pc.bold(`botonic train\n`) : ''
    const serveCmd = `${pc.bold('botonic serve')} (test your bot locally from the browser)\n`
    feedback += serveCmd
    const deployCmd = `${pc.bold('botonic deploy')} (publish your bot to the world!)`
    feedback += deployCmd
    return feedback
  }
}
