import { PreviewResult, UpResult } from '@pulumi/pulumi/automation'
import concurrently from 'concurrently'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { env } from 'process'

import { getWebchatBotonicPath } from '..'
import {
  CacheInvalidator,
  getUpdatedObjectsFromPreview,
  INVALIDATION_PATH_PREFIX,
} from '../aws/cache-invalidator'
import {
  deployBackendStack,
  deployFrontendStack,
} from '../aws/deployment-stacks'
import {
  HTTPS_PROTOCOL_PREFIX,
  REST_SERVER_ENDPOINT_PATH_NAME,
  WEBSOCKET_ENDPOINT_PATH_NAME,
  WSS_PROTOCOL_PREFIX,
} from '../constants'
import {
  BACKEND_STACK_NAME,
  BUILD_COMMANDS,
  FRONTEND_STACK_NAME,
  PULUMI_BINARY_NAME,
} from './constants'
import { PulumiAuthenticator } from './pulumi-authenticator'
import { PulumiDownloader } from './pulumi-downloader'
import { StackRunner } from './stack-runner'
import {
  AWSCredentials,
  BuildCommand,
  ProjectConfig,
  PulumiConfig,
} from './types'

export class PulumiCoordinator {
  private downloader: PulumiDownloader
  private authenticator: PulumiAuthenticator
  private projectConfig: ProjectConfig
  private updatedBucketObjects: string[] = []

  constructor(
    pulumiConfig: PulumiConfig,
    projectConfig: ProjectConfig,
    downloader: PulumiDownloader,
    authenticator: PulumiAuthenticator
  ) {
    this.definePulumiEnvironment(pulumiConfig)
    this.downloader = downloader
    this.authenticator = authenticator
    this.projectConfig = projectConfig
  }

  definePulumiEnvironment(pulumiConfig: PulumiConfig): void {
    env.PULUMI_HOME = pulumiConfig.pulumiHome
    env.PULUMI_CREDENTIALS_PATH = pulumiConfig.pulumiCredentialsPath
    env.PULUMI_ACCESS_TOKEN = pulumiConfig.pulumiAccessToken
    env.PULUMI_CONFIG_PASSPHRASE = pulumiConfig.pulumiConfigPassphrase
  }

  async init(): Promise<void> {
    const { binaryPath } = await this.downloader.downloadBinaryIfNotInstalled()
    env.PATH = `${env.PATH}:${binaryPath}` // path to directory where pulumi bin is located to allow executing stack commands
    this.authenticator.doLogin(`${join(binaryPath, PULUMI_BINARY_NAME)}`)
  }

  async build(commands: BuildCommand[] = BUILD_COMMANDS): Promise<void> {
    try {
      if (commands.length > 0) {
        if (env.BOTONIC_JWT_SECRET === undefined) {
          const errMsg =
            'You must export an env variable BOTONIC_JWT_SECRET with your secret for authenticating users.'
          throw new Error(errMsg)
        }
        console.log('Building...')
        await concurrently(commands)
      }
    } catch (e) {
      throw new Error(String(e))
    }
  }

  getUpdatedConfigWithBackendResults(
    updateBackendResults: UpResult
  ): ProjectConfig {
    const projectConfig = { ...this.projectConfig }
    const websocketUrl = updateBackendResults.outputs['websocketUrl'].value
    projectConfig['websocketUrl'] = websocketUrl
    const apiUrl = updateBackendResults.outputs['apiUrl'].value
    projectConfig['apiUrl'] = apiUrl
    projectConfig['nlpModelsUrl'] =
      updateBackendResults.outputs['nlpModelsUrl'].value
    const websocketReplacementUrl = projectConfig?.customDomain
      ? `${WSS_PROTOCOL_PREFIX}${projectConfig.customDomain}/${WEBSOCKET_ENDPOINT_PATH_NAME}/`
      : websocketUrl
    this.replaceMatchWithinWebchat(/WEBSOCKET_URL/g, websocketReplacementUrl)
    const restApiReplacementUrl = projectConfig?.customDomain
      ? `${HTTPS_PROTOCOL_PREFIX}${projectConfig.customDomain}/${REST_SERVER_ENDPOINT_PATH_NAME}/`
      : apiUrl
    this.replaceMatchWithinWebchat(/REST_API_URL/g, restApiReplacementUrl)
    return projectConfig
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

  private async updateUpdatedBucketObjects(
    previewResults: PreviewResult
  ): Promise<void> {
    this.updatedBucketObjects = this.updatedBucketObjects.concat(
      getUpdatedObjectsFromPreview(previewResults.stdout)
    )
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

  private async prepareStack(stackRunner: StackRunner) {
    await stackRunner.init()
    await stackRunner.initAWSProvider()
    await stackRunner.refresh()
  }

  private async deployBackend(
    backendStackConfig: ProjectConfig
  ): Promise<UpResult> {
    const backendStack = new StackRunner(
      BACKEND_STACK_NAME,
      deployBackendStack,
      backendStackConfig
    )
    await this.prepareStack(backendStack)
    const backendResults = await backendStack.update()
    return backendResults
  }

  private async deployFrontend(
    frontendStackConfig: ProjectConfig
  ): Promise<UpResult> {
    const frontendStack = new StackRunner(
      FRONTEND_STACK_NAME,
      deployFrontendStack,
      frontendStackConfig
    )
    await this.prepareStack(frontendStack)
    const frontendPreviewResults = await frontendStack.preview()
    await this.updateUpdatedBucketObjects(frontendPreviewResults)
    const frontendResults = await frontendStack.update()
    return frontendResults
  }

  async deploy(commands?: BuildCommand[]): Promise<void> {
    await this.build(commands)
    const backendResults = await this.deployBackend(this.projectConfig)
    const frontendStackConfig = this.getUpdatedConfigWithBackendResults(
      backendResults
    )
    const frontendResults = await this.deployFrontend(frontendStackConfig)
    if (frontendResults && this.updatedBucketObjects.length > 0) {
      await this.doInvalidateUpdatedFiles(
        frontendResults,
        this.updatedBucketObjects
      )
    }
  }

  async destroy(): Promise<void> {
    await this.destroyBackend(this.projectConfig)
    await this.destroyFrontend(this.projectConfig)
  }

  private async destroyBackend(
    backendStackConfig: ProjectConfig
  ): Promise<void> {
    const backendStack = new StackRunner(
      BACKEND_STACK_NAME,
      deployBackendStack,
      backendStackConfig
    )
    await this.prepareStack(backendStack)
    await backendStack.destroy()
  }

  private async destroyFrontend(
    frontendStackConfig: ProjectConfig
  ): Promise<void> {
    const frontendStack = new StackRunner(
      FRONTEND_STACK_NAME,
      deployFrontendStack,
      frontendStackConfig
    )
    await this.prepareStack(frontendStack)
    await frontendStack.destroy()
  }
}
