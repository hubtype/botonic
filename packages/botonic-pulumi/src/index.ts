import { Config } from '@pulumi/pulumi'
import { tmpdir } from 'os'
import { join } from 'path'
import { cwd } from 'process'

export const PROJECT_NAME_SEPARATOR = '-'
export const MAX_PROJECT_NAME_LENGTH = 30

export function getProjectStackNamePrefix(): string {
  const config = new Config()
  return generateProjectStackNamePrefix(
    config.get('projectName') as string,
    config.get('stackName') as string
  )
}

export function generateProjectStackNamePrefix(
  projectName: string,
  stackName: string
): string {
  const prefix = `${projectName}${PROJECT_NAME_SEPARATOR}${stackName}`
  if (prefix.length > MAX_PROJECT_NAME_LENGTH + PROJECT_NAME_SEPARATOR.length) {
    throw new Error(
      `Provided projectName "${projectName}" and stackName "${stackName}" that combined exceed the max allowed length: ${
        prefix.length - PROJECT_NAME_SEPARATOR.length
      } / ${MAX_PROJECT_NAME_LENGTH}`
    )
  }
  return prefix
}
// const MAIN_DIRECTORY = cwd()
const MAIN_DIRECTORY = join(tmpdir(), 'botonic-dist', 'dist')

export const NLP_MODELS_PATH = join(
  MAIN_DIRECTORY,
  'bot',
  'src',
  'nlp',
  'tasks'
)
export const WEBSOCKET_SERVER_PATH = join(
  MAIN_DIRECTORY,
  'api',
  'dist',
  'websocket'
)
export const REST_SERVER_PATH = join(MAIN_DIRECTORY, 'api', 'dist', 'rest')
export const HANDLERS_PATH = join(MAIN_DIRECTORY, 'api', 'dist', 'handlers')
export const BOT_EXECUTOR_LAMBDA_NAME = 'botExecutor'
export const SENDER_LAMBDA_NAME = 'sender'
export const WEBCHAT_CONTENTS_PATH = join(MAIN_DIRECTORY, 'webchat', 'dist')
export const WEBSOCKET_ENDPOINT_PATH_NAME = 'ws'
export const REST_SERVER_ENDPOINT_PATH_NAME = 'api'
export const WSS_PROTOCOL_PREFIX = 'wss://'
export const HTTPS_PROTOCOL_PREFIX = 'https://'

export const WEBCHAT_BOTONIC_PATH = join(
  MAIN_DIRECTORY,
  'webchat',
  'dist',
  'webchat.botonic.js'
)

export * from './pulumi-runner'
