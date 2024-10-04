import childProcess from 'child_process'
import { promises as fs } from 'fs'
import ora from 'ora'
import path from 'path'
import * as util from 'util'

const BOTONIC_PREFIX_PACKAGE = '@botonic'
const BOTONIC_CORE_PACKAGE = `${BOTONIC_PREFIX_PACKAGE}/core`
const botonicCliVersionRegex = /@botonic\/cli\/([^ ]+)/
const NPM_DEPTH_1 = 1
const NPM_DEPTH_0 = 0

// Also get alpha and beta versions
const versionRegex = /@botonic\/[^@]+@(\d+\.\d+\.\d+(-[a-zA-Z]+\.\d+)?)/

type BotonicDependencies = Record<string, { version: string }>

export interface BotConfigJSON {
  build_info: {
    node_version: string
    npm_version: string
    botonic_cli_version: string
  }
  packages: BotonicDependencies
}
export class BotConfig {
  static async get(appDirectory: string): Promise<BotConfigJSON> {
    const spinner = ora({
      text: 'Getting bot config...',
      spinner: 'bouncingBar',
    }).start()
    const packages = await this.getBotonicDependencies(appDirectory)
    const [nodeVersion, npmVersion, botonicCli] = await Promise.all(
      ['node -v', 'npm -v', 'botonic -v'].map(command =>
        this.getOutputByCommand(command)
      )
    )
    const botonicCliVersion =
      botonicCli.match(botonicCliVersionRegex)?.[1] || ''
    spinner.succeed()

    return {
      build_info: {
        node_version: nodeVersion,
        npm_version: npmVersion,
        botonic_cli_version: botonicCliVersion,
      },
      packages,
    }
  }

  private static async getBotonicDependencies(
    appDirectory: string
  ): Promise<BotonicDependencies> {
    const packages = {}
    try {
      const packageJsonPath = path.join(appDirectory, 'package.json')
      const data = await fs.readFile(packageJsonPath, 'utf8')
      const packageJson = JSON.parse(data)

      const botonicDependencies = Object.keys(packageJson.dependencies).filter(
        dependency => dependency.startsWith(BOTONIC_PREFIX_PACKAGE)
      )
      if (!botonicDependencies.includes(BOTONIC_CORE_PACKAGE)) {
        botonicDependencies.push(BOTONIC_CORE_PACKAGE)
      }

      await Promise.all(
        botonicDependencies.map(botonicDependency => {
          return this.setDependenciesVersion(
            botonicDependency,
            packages,
            botonicDependency === BOTONIC_CORE_PACKAGE
              ? NPM_DEPTH_1
              : NPM_DEPTH_0
          )
        })
      )
    } catch (err: any) {
      console.error(`Error: ${err.message}`)
    }
    return packages
  }

  private static async setDependenciesVersion(
    dependency: string,
    packages: Record<string, any>,
    depth: number = NPM_DEPTH_0
  ): Promise<BotonicDependencies> {
    try {
      const output = await this.getOutputByCommand(
        `npm ls ${dependency} --depth=${depth}`
      )
      const match = output.match(versionRegex)
      const installedVersion = match ? match[1] : ''
      packages[dependency] = { version: installedVersion }
    } catch (error: any) {
      console.error(error)
    }
    return packages
  }

  private static async getOutputByCommand(command: string): Promise<string> {
    const exec = util.promisify(childProcess.exec)
    const { stdout } = await exec(command)
    return stdout.trim()
  }
}
