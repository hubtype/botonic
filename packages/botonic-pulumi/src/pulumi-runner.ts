import {
  InlineProgramArgs,
  LocalWorkspace,
  Stack,
  UpResult,
} from '@pulumi/pulumi/automation'
import concurrently from 'concurrently'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { env } from 'process'

import {
  generateProjectStackNamePrefix,
  HTTPS_PROTOCOL_PREFIX,
  PROJECT_NAME_SEPARATOR,
  REST_SERVER_ENDPOINT_PATH_NAME,
  WEBCHAT_BOTONIC_PATH,
  WEBSOCKET_ENDPOINT_PATH_NAME,
  WSS_PROTOCOL_PREFIX,
} from './'
import { getWebchatBotonicPath } from './'
import {
  CacheInvalidator,
  getUpdatedObjectsFromPreview,
  INVALIDATION_PATH_PREFIX,
} from './aws/cache-invalidator'
import {
  deployBackendStack,
  deployFrontendStack,
} from './aws/deployment-stacks'
import { PulumiDownloader } from './pulumi-downloader'
import { getCleanVersionForPackage, getHomeDirectory } from './system-utils'

export interface AWSCredentials {
  region?: string
  profile?: string
  accessKey?: string
  secretKey?: string
  token?: string
}
export interface ProjectConfig extends AWSCredentials {
  workingDirectory?: string
  projectName?: string
  stackName?: string
  customDomain?: string
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

const BUILD_COMMANDS = [
  {
    name: 'WebSocket Server Build',
    command: 'yarn workspace api build:websocket',
  },
  {
    name: 'Handlers Build',
    command: 'yarn workspace api build:handlers',
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

// Things to be able to configure:
/**
 * PULUMI_HOME
 * MAIN_DIRECTORY to different handlers, server code, etc..
 * How Pulumi logs in
 */

export class PulumiRunner {
  private isDestroy = false
  private programConfig: ProgramConfig
  private updatedBucketObjects: string[] = []
  public projectConfig: ProjectConfig = {}
  private buildCommands: concurrently.CommandObj[] | string[]
  private pathToBinary: string
  pulumiDownloader: PulumiDownloader

  constructor(
    projectConfig: ProjectConfig,
    binaryPath: string,
    workingDirectory: string,
    buildCommands = BUILD_COMMANDS
  ) {
    this.projectConfig = { ...projectConfig, workingDirectory }
    this.programConfig = this.projectConfig as ProgramConfig
    this.buildCommands = buildCommands
    this.pathToBinary = binaryPath
    env.PATH = `${env.PATH}:${binaryPath}` // path to directory where pulumi bin is located to allow executing stack commands
  }

  private async beforeRun(isDestroy: boolean): Promise<void> {
    this.isDestroy = isDestroy
    if (!this.isDestroy) {
      if (env.BOTONIC_JWT_SECRET === undefined) {
        const errMsg =
          'You must export an env variable BOTONIC_JWT_SECRET with your secret for authenticating users.'
        throw new Error(errMsg)
      }
      try {
        if (this.buildCommands.length > 0) {
          await concurrently(this.buildCommands)
        }
      } catch (e) {
        throw new Error(e)
      }
    }
    env.PULUMI_CONFIG_PASSPHRASE = env.PULUMI_CONFIG_PASSPHRASE || ''
  }

  private async initStack(
    stackToDeploy: 'backend' | 'frontend'
  ): Promise<Stack> {
    const projectName = this.projectConfig?.projectName || 'botonic'
    const stackName = this.projectConfig?.stackName || 'full-stack'
    const prefix = generateProjectStackNamePrefix(projectName, stackName)
    const args: InlineProgramArgs = {
      projectName,
      stackName: `${prefix}${PROJECT_NAME_SEPARATOR}${stackToDeploy}`,
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
    // this gets defined by PULUMI_HOME
    // const awsPluginVersion = `v${getCleanVersionForPackage('@pulumi/aws')}`
    const awsPluginVersion = `v4.25.0` // not working with 4.27.1 (no space left in device, lambda)
    const awsPluginName = `resource-aws-${awsPluginVersion}`
    const pluginInstallationPath = join(
      // @ts-ignore
      env.PULUMI_HOME,
      'plugins',
      awsPluginName
    )
    if (!existsSync(pluginInstallationPath)) {
      console.info(`installing plugin ${awsPluginName}...`)
      await stack.workspace.installPlugin('aws', awsPluginVersion)
      console.info('plugin installed.')
    } else {
      console.log(`Detected plugin ${awsPluginName}`)
    }
  }

  private async withAwsProvider(stack: Stack): Promise<Stack> {
    try {
      await this.installAwsPlugin(stack)
    } catch (e) {
      console.error({ e })
    }

    console.log('setting up AWS config...')
    await stack.setConfig('aws:region', {
      value: this.projectConfig.region || env.DEFAULT_AWS_REGION || 'eu-west-1',
    })
    await stack.setConfig('aws:profile', {
      value: this.projectConfig.profile || env.AWS_PROFILE || 'default',
    })
    await stack.setConfig('aws:accessKey', {
      value: this.projectConfig.accessKey || env.AWS_ACCESS_KEY_ID || '',
    })
    await stack.setConfig('aws:secretKey', {
      value: this.projectConfig.secretKey || env.AWS_SECRET_ACCESS_KEY || '',
    })
    await stack.setConfig('aws:token', {
      value: this.projectConfig.token || env.AWS_SESSION_TOKEN || '',
    })
    return stack
  }

  private async refreshStack(stack: Stack): Promise<void> {
    console.info('refreshing stack...')
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

  private async updateUpdatedBucketObjects(stack: Stack): Promise<void> {
    const previewRes = await stack.preview()
    this.updatedBucketObjects = this.updatedBucketObjects.concat(
      getUpdatedObjectsFromPreview(previewRes.stdout)
    )
  }

  private replaceMatchWithinWebchat(regex: RegExp, replacement: string): void {
    const workingDirectory = this.projectConfig.workingDirectory as string
    const webchatBotonicPath = getWebchatBotonicPath(workingDirectory)
    let fileContent = readFileSync(webchatBotonicPath, {
      encoding: 'utf8',
    })
    fileContent = fileContent.replace(regex, `"${replacement}"`)
    writeFileSync(webchatBotonicPath, fileContent, { encoding: 'utf8' })
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
      await this.updateUpdatedBucketObjects(stack)
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
    try {
      const backendResults = await this.runStack('backend')
      if (backendResults) {
        const websocketUrl = backendResults.outputs['websocketUrl'].value
        this.programConfig['websocketUrl'] = websocketUrl
        const apiUrl = backendResults.outputs['apiUrl'].value
        this.programConfig['apiUrl'] = apiUrl
        this.programConfig['nlpModelsUrl'] =
          backendResults.outputs['nlpModelsUrl'].value
        const websocketReplacementUrl = this.projectConfig?.customDomain
          ? `${WSS_PROTOCOL_PREFIX}${this.projectConfig.customDomain}/${WEBSOCKET_ENDPOINT_PATH_NAME}/`
          : websocketUrl
        this.replaceMatchWithinWebchat(
          /WEBSOCKET_URL/g,
          websocketReplacementUrl
        )
        const restApiReplacementUrl = this.projectConfig?.customDomain
          ? `${HTTPS_PROTOCOL_PREFIX}${this.projectConfig.customDomain}/${REST_SERVER_ENDPOINT_PATH_NAME}/`
          : apiUrl
        this.replaceMatchWithinWebchat(/REST_API_URL/g, restApiReplacementUrl)
      }
      const frontendResults = await this.runStack('frontend')
      if (frontendResults && this.updatedBucketObjects.length > 0) {
        await this.doInvalidateUpdatedFiles(
          frontendResults,
          this.updatedBucketObjects
        )
      }
    } catch (e) {
      console.log({ e })
    }

    return
  }

  private async doInvalidateUpdatedFiles(
    updateResults: UpResult,
    updatedBucketObjects: string[]
  ): Promise<void> {
    try {
      const cacheInvalidator = new CacheInvalidator(
        this.projectConfig as AWSCredentials
      )
      const cloudfrontId = updateResults.outputs['cloudfrontId'].value
      await cacheInvalidator.invalidateBucketObjects(
        cloudfrontId,
        INVALIDATION_PATH_PREFIX,
        updatedBucketObjects
      )
    } catch (e) {
      console.log('Could not invalidate cache for files.', e)
    }
  }
}
