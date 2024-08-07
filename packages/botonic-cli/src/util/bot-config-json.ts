import childProcess from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import * as util from 'util'

const OUTPUT_JSON_NAME = 'bot.config.json'
const BOTONIC_PREFIX_PACKAGE = '@botonic'
const BOTONIC_CORE_PACKAGE = `${BOTONIC_PREFIX_PACKAGE}/core`

// Also get alpha and beta versions
const versionRegex = /@botonic\/[^@]+@(\d+\.\d+\.\d+(-[a-zA-Z]+\.\d+)?)/

export class BotConfigJson {
  constructor(public appDirectory: string) {}

  async updateBotConfigJson(): Promise<void> {
    const packages = await this.readPackageJson()
    const nodeVersion = await this.getOutputByCommnd('node -v')
    const npmVersion = await this.getOutputByCommnd('npm -v')
    const oldBotConfigJSON = await this.readOldBotConfigJSON()
    const newBotConfigJSON = {
      ...oldBotConfigJSON,
      build_info: {
        node_version: nodeVersion,
        npm_version: npmVersion,
      },
      packages,
    }
    await this.writeBotConfigJSON(newBotConfigJSON)
    await this.writeBotConfigJSON(newBotConfigJSON, ['dist'])
  }

  private async readPackageJson(): Promise<Record<string, any>> {
    const packages = {}
    try {
      const packageJsonPath = path.join(this.appDirectory, 'package.json')
      const data = await fs.readFile(packageJsonPath, 'utf8')
      const packageJson = JSON.parse(data)

      const botonicDependecies = Object.keys(packageJson.dependencies).filter(
        dependency => dependency.startsWith(BOTONIC_PREFIX_PACKAGE)
      )
      if (!botonicDependecies.includes(BOTONIC_CORE_PACKAGE)) {
        botonicDependecies.push(BOTONIC_CORE_PACKAGE)
      }

      await Promise.all(
        botonicDependecies.map(botonicDependecy => {
          return this.getBotonicDependenciesWithoutDepth(
            botonicDependecy,
            packages,
            botonicDependecy === BOTONIC_CORE_PACKAGE ? 1 : 0
          )
        })
      )
    } catch (err) {
      console.error(`Error: ${err.message}`)
    }
    return packages
  }

  private async getBotonicDependenciesWithoutDepth(
    botonicDependecy: string,
    packages: Record<string, any>,
    depth: number = 0
  ) {
    try {
      const output = await this.getOutputByCommnd(
        `npm ls ${botonicDependecy} --depth=${depth}`
      )
      const match = output.match(versionRegex)
      const installedVersion = match ? match[1] : ''
      packages[botonicDependecy] = installedVersion
    } catch (error: any) {
      console.error(error)
    }
    return packages
  }

  private async getOutputByCommnd(command: string): Promise<string> {
    const exec = util.promisify(childProcess.exec)
    const { stdout } = await exec(command)
    return stdout.trim()
  }

  private async readOldBotConfigJSON(): Promise<Record<string, any>> {
    try {
      const oldBotConfigJSON = path.join(this.appDirectory, OUTPUT_JSON_NAME)
      const data = await fs.readFile(oldBotConfigJSON, 'utf8')
      return JSON.parse(data)
    } catch (err) {
      console.error(
        `Error reading ${OUTPUT_JSON_NAME} in app directory: ${err.message}`
      )
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
    } catch (err) {
      console.error(
        `Error writing ${OUTPUT_JSON_NAME} in ${this.appDirectory}/${paths.join('/')}: ${err.message}`
      )
    }
  }
}
