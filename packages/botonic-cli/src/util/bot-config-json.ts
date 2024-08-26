import childProcess from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import * as util from 'util'

const OUTPUT_JSON_NAME = 'bot.config.json'
const BOTONIC_PREFIX_PACKAGE = '@botonic'
const BOTONIC_CORE_PACKAGE = `${BOTONIC_PREFIX_PACKAGE}/core`
const NPM_DEPTH_1 = 1
const NPM_DEPTH_0 = 0

// Also get alpha and beta versions
const versionRegex = /@botonic\/[^@]+@(\d+\.\d+\.\d+(-[a-zA-Z]+\.\d+)?)/

export interface BotConfigJson {
  build_info: {
    node_version: string
    npm_version: string
    botonic_cli_version: string
  }
  packages: Record<string, any>
}
export class BotConfig {
  constructor(public appDirectory: string) {}

  async createJson(): Promise<BotConfigJson> {
    const packages = await this.readPackageJson()
    const [nodeVersion, npmVersion, botonicCli] = await Promise.all(
      ['node -v', 'npm -v', 'botonic -v'].map(command =>
        this.getOutputByCommand(command)
      )
    )
    const oldBotConfigJSON = await this.readOldBotConfigJSON()
    const newBotConfigJSON = {
      ...oldBotConfigJSON,
      build_info: {
        node_version: nodeVersion,
        npm_version: npmVersion,
        botonic_cli_version: botonicCli,
      },
      packages,
    }
    await this.writeBotConfigJSON(newBotConfigJSON)
    return newBotConfigJSON
  }

  private async readPackageJson(): Promise<Record<string, any>> {
    const packages = {}
    try {
      const packageJsonPath = path.join(this.appDirectory, 'package.json')
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

  private async setDependenciesVersion(
    dependency: string,
    packages: Record<string, any>,
    depth: number = NPM_DEPTH_0
  ) {
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

  private async getOutputByCommand(command: string): Promise<string> {
    const exec = util.promisify(childProcess.exec)
    const { stdout } = await exec(command)
    return stdout.trim()
  }

  private async readOldBotConfigJSON(): Promise<Record<string, any>> {
    try {
      const oldBotConfigJSON = path.join(this.appDirectory, OUTPUT_JSON_NAME)
      const data = await fs.readFile(oldBotConfigJSON, 'utf8')
      return JSON.parse(data)
    } catch (err: any) {
      console.error(`Cannot read ${OUTPUT_JSON_NAME} in app directory`)
      return {}
    }
  }

  private async writeBotConfigJSON(
    botConfig: Record<string, any>,
    paths: string[] = []
  ): Promise<void> {
    paths.push(OUTPUT_JSON_NAME)
    try {
      const botConfigPath = path.join(this.appDirectory, ...paths)
      await fs.writeFile(botConfigPath, JSON.stringify(botConfig, null, 2))
    } catch (err: any) {
      console.error(
        `Error writing ${OUTPUT_JSON_NAME} in ${this.appDirectory}/${paths.join('/')}: ${err.message}`
      )
    }
  }
}
