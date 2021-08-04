import {
  InlineProgramArgs,
  LocalWorkspace,
  Stack,
  UpResult,
} from '@pulumi/pulumi/automation'
import { execSync } from 'child_process'
import concurrently from 'concurrently'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { env } from 'process'

import { WEBCHAT_BOTONIC_PATH, WEBSOCKET_ENDPOINT_PATH_NAME } from './'
import {
  deployBackendStack,
  deployFrontendStack,
} from './aws/deployment-stacks'
import { PulumiDownloader } from './pulumi-downloader'
import { getCleanVersionForPackage, getHomeDirectory } from './system-utils'

export interface ProjectConfig {
  projectName?: string
  stackName?: string
  customDomain?: string
  // AWS Authentication Params
  region?: string
  profile?: string
  accessKey?: string
  secretKey?: string
  token?: string
  tags?: Record<string, string>
  // DynamoDB
  tableName?: string
}

export interface ProgramConfig extends ProjectConfig {
  nlpModelsUrl: string
  websocketUrl: string
  apiUrl: string
}

export interface RunOptions {
  destroy: boolean
}

export class PulumiRunner {
  private pulumiDownloader = new PulumiDownloader()
  private isDestroy = false
  private programConfig: ProgramConfig
  public projectConfig: ProjectConfig = {}
  private commands = [
    {
      name: 'WebSocket Server Build',
      command: 'yarn workspace api build:websocket',
    },
    {
      name: 'Rest Server Build',
      command: 'yarn workspace api build:rest',
    },
    {
      name: 'Static Contents Build',
      command: 'yarn workspace webchat build',
    },
  ]

  constructor(pathToProjectConfig: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      this.projectConfig = require(pathToProjectConfig).default
    } catch (e) {
      this.projectConfig = {}
    }
    this.programConfig = this.projectConfig as ProgramConfig
  }

  private async beforeRun(isDestroy: boolean): Promise<void> {
    this.isDestroy = isDestroy
    if (!this.isDestroy) {
      try {
        await concurrently(this.commands)
      } catch (e) {
        throw new Error(e)
      }
    }
    await this.pulumiDownloader.downloadBinaryIfNotInstalled()
    this.setExecutionVariables()
    this.doPulumiLoginLocally()
  }

  private async initStack(
    stackToDeploy: 'backend' | 'frontend'
  ): Promise<Stack> {
    const projectName = this.projectConfig?.projectName || 'botonic'
    const stackName = this.projectConfig?.stackName || 'full-stack'
    const args: InlineProgramArgs = {
      projectName,
      stackName: `${stackToDeploy}-${stackName}`,
      program: async () => {
        return stackToDeploy === 'backend'
          ? await deployBackendStack(this.programConfig)
          : await deployFrontendStack(this.programConfig)
      },
    }
    const stack = await LocalWorkspace.createOrSelectStack(args)
    await stack.setConfig('projectName', { value: projectName })
    await stack.setConfig('stackName', { value: stackName })
    console.info(`successfully initialized ${stackToDeploy} stack`)
    return stack
  }

  private async installAwsPlugin(stack: Stack): Promise<void> {
    const awsPluginVersion = `v${getCleanVersionForPackage('@pulumi/aws')}`
    const pluginInstallationPath = join(
      getHomeDirectory(),
      '.pulumi',
      'plugins',
      `resource-aws-${awsPluginVersion}`
    )
    if (!existsSync(pluginInstallationPath)) {
      console.info('installing plugins...')
      await stack.workspace.installPlugin('aws', awsPluginVersion)
      console.info('plugins installed')
    }
  }

  private async withAwsProvider(stack: Stack): Promise<Stack> {
    await this.installAwsPlugin(stack)
    console.log('setting up AWS config...')
    await stack.setConfig('aws:region', {
      value:
        this.projectConfig.region ||
        process.env.DEFAULT_AWS_REGION ||
        'eu-west-1',
    })
    await stack.setConfig('aws:profile', {
      value: this.projectConfig.profile || process.env.AWS_PROFILE || 'default',
    })
    await stack.setConfig('aws:accessKey', {
      value:
        this.projectConfig.accessKey || process.env.AWS_ACCESS_KEY_ID || '',
    })
    await stack.setConfig('aws:secretKey', {
      value:
        this.projectConfig.secretKey || process.env.AWS_SECRET_ACCESS_KEY || '',
    })
    await stack.setConfig('aws:token', {
      value: this.projectConfig.token || process.env.AWS_SESSION_TOKEN || '',
    })
    return stack
  }

  private async refreshStack(stack: Stack): Promise<void> {
    console.info('refreshing stack...')
    // await stack.refresh({ onOutput: console.info })
    await stack.refresh()
    console.info('refresh complete')
  }

  private async destroyStack(stack: Stack): Promise<void> {
    console.info('destroying stack...')
    await stack.destroy({ onOutput: console.info })
    console.info('stack destroy complete')
  }

  private async updateStack(stack: Stack): Promise<UpResult> {
    console.info('updating stack...')
    const upRes = await stack.up({ onOutput: console.info })
    console.log(
      `update summary: \n${JSON.stringify(
        upRes.summary.resourceChanges,
        null,
        4
      )}`
    )
    return upRes
  }

  private replaceWithWebSocketUrl(websocketUrl: string): void {
    let fileContent = readFileSync(WEBCHAT_BOTONIC_PATH, {
      encoding: 'utf8',
    })
    fileContent = fileContent.replace('WEBSOCKET_URL', `"${websocketUrl}"`)
    writeFileSync(WEBCHAT_BOTONIC_PATH, fileContent, { encoding: 'utf8' })
  }

  private async runStack(
    stackToDeploy: 'backend' | 'frontend'
  ): Promise<UpResult | undefined> {
    const stack = await this.withAwsProvider(
      await this.initStack(stackToDeploy)
    )
    await this.refreshStack(stack)
    if (this.isDestroy) {
      await this.destroyStack(stack)
      return undefined
    } else {
      const updateResults = await this.updateStack(stack)
      return updateResults
    }
  }

  async deploy(): Promise<void> {
    await this.run({ destroy: false })
  }

  async destroy(): Promise<void> {
    await this.run({ destroy: true })
  }

  private async run({ destroy = false }: RunOptions): Promise<undefined> {
    await this.beforeRun(destroy)
    const backendResults = await this.runStack('backend')
    if (backendResults) {
      const websocketUrl = backendResults.outputs['websocketUrl'].value
      this.programConfig['websocketUrl'] = websocketUrl
      this.programConfig['apiUrl'] = backendResults.outputs['apiUrl'].value
      this.programConfig['nlpModelsUrl'] =
        backendResults.outputs['nlpModelsUrl'].value
      const websocketReplacementUrl = this.projectConfig?.customDomain
        ? `wss://${this.projectConfig.customDomain}/${WEBSOCKET_ENDPOINT_PATH_NAME}/`
        : websocketUrl
      this.replaceWithWebSocketUrl(websocketReplacementUrl)
    }
    const frontendResults = await this.runStack('frontend')
    return
  }

  private setExecutionVariables(): void {
    env.PULUMI_CONFIG_PASSPHRASE = process.env.PULUMI_CONFIG_PASSPHRASE || ''
    env.PATH += `:${this.pulumiDownloader.getBinaryPath()}`
  }

  private doPulumiLoginLocally(): void {
    // TODO: Login in our S3 bucket ?
    // TODO: Leave it configurable
    execSync(`pulumi login --local --non-interactive`)
  }
}
