import {
  InlineProgramArgs,
  LocalWorkspace,
  PreviewResult,
  Stack,
  UpResult,
} from '@pulumi/pulumi/automation'
import { existsSync } from 'fs'
import { join } from 'path'
import { env } from 'process'

import { getCleanVersionForPackage } from '../system-utils'
import { PROJECT_NAME_SEPARATOR } from './constants'
import { generateProjectStackNamePrefix } from './project-utils'
import { ProjectConfig } from './types'

export class StackRunner {
  private _stack: Stack
  stackName: string
  program: any
  projectConfig: ProjectConfig

  constructor(stackName: string, program: any, projectConfig: ProjectConfig) {
    this.stackName = stackName
    this.program = program
    this.projectConfig = projectConfig
  }

  async init(): Promise<void> {
    const projectName = this.projectConfig?.projectName || 'botonic'
    const stackName = this.projectConfig?.stackName || 'full-stack'
    const prefix = generateProjectStackNamePrefix(projectName, stackName)
    const args: InlineProgramArgs = {
      projectName,
      stackName: `${prefix}${PROJECT_NAME_SEPARATOR}${this.stackName}`,
      program: async () => await this.program(this.projectConfig),
    }
    this._stack = await LocalWorkspace.createOrSelectStack(args)
    await this._stack.setConfig('projectName', { value: projectName })
    await this._stack.setConfig('stackName', { value: stackName })
    console.info(`successfully initialized ${this.stackName} stack`)
  }

  async installAwsPlugin(
    version = `${getCleanVersionForPackage('@pulumi/aws')}`
  ): Promise<void> {
    const awsPluginVersion = `v${version}` // not working with 4.27.1 (no space left in device, lambda)
    const awsPluginName = `resource-aws-${awsPluginVersion}`
    const pluginInstallationPath = join(
      // @ts-ignore
      env.PULUMI_HOME,
      'plugins',
      awsPluginName
    )
    if (!existsSync(pluginInstallationPath)) {
      console.info(`installing plugin ${awsPluginName}...`)
      await this._stack.workspace.installPlugin('aws', awsPluginVersion)
      console.info('plugin installed.')
    } else {
      console.log(`Detected plugin ${awsPluginName}`)
    }
  }

  async initAWSProvider(version?: string | undefined): Promise<void> {
    try {
      await this.installAwsPlugin(version)
    } catch (e) {
      console.error({ e })
    }

    console.log('setting up AWS config...')
    await this._stack.setConfig('aws:region', {
      value: this.projectConfig.region || env.DEFAULT_AWS_REGION || 'eu-west-1',
    })
    await this._stack.setConfig('aws:profile', {
      value: this.projectConfig.profile || env.AWS_PROFILE || 'default',
    })
    await this._stack.setConfig('aws:accessKey', {
      value: this.projectConfig.accessKey || env.AWS_ACCESS_KEY_ID || '',
    })
    await this._stack.setConfig('aws:secretKey', {
      value: this.projectConfig.secretKey || env.AWS_SECRET_ACCESS_KEY || '',
    })
    await this._stack.setConfig('aws:token', {
      value: this.projectConfig.token || env.AWS_SESSION_TOKEN || '',
    })
  }

  async preview(): Promise<PreviewResult> {
    console.info('previewing stack...')
    const previewResult = await this._stack.preview()
    console.info('preview complete')
    return previewResult
  }

  async refresh(): Promise<void> {
    console.info('refreshing stack...')
    await this._stack.refresh()
    console.info('refresh complete')
  }

  async update(): Promise<UpResult> {
    console.info('updating stack...')
    const updateResult = await this._stack.up({ onOutput: console.info })
    console.log(
      `update summary: \n${JSON.stringify(
        updateResult.summary.resourceChanges,
        null,
        4
      )}`
    )
    return updateResult
  }

  async destroy(): Promise<void> {
    console.info('destroying stack...')
    await this._stack.destroy({ onOutput: console.info })
    console.info('stack destroy complete')
  }

  get stack(): Stack {
    return this._stack
  }
}
