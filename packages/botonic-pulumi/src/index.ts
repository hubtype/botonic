import { Config } from '@pulumi/pulumi'
import { join } from 'path'

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

export const NLP_MODELS_PATH = join('bot', 'src', 'nlp', 'tasks')
export const getNlpModelsPath = (workingDirectory: string): string =>
  join(workingDirectory, NLP_MODELS_PATH)

export const WEBSOCKET_SERVER_PATH = join('api', 'dist', 'websocket')
export const getWebsocketServerPath = (workingDirectory: string): string =>
  join(workingDirectory, WEBSOCKET_SERVER_PATH)

export const REST_SERVER_PATH = join('api', 'dist', 'rest')
export const getRestServerPath = (workingDirectory: string): string =>
  join(workingDirectory, REST_SERVER_PATH)

export const HANDLERS_PATH = join('api', 'dist', 'handlers')
export const getHandlersPath = (workingDirectory: string): string =>
  join(workingDirectory, HANDLERS_PATH)

export const WEBCHAT_CONTENTS_PATH = join('webchat', 'dist')
export const getPathToWebchatContents = (workingDirectory: string): string =>
  join(workingDirectory, WEBCHAT_CONTENTS_PATH)

export const WEBCHAT_BOTONIC_PATH = join(
  'webchat',
  'dist',
  'webchat.botonic.js'
)
export const getWebchatBotonicPath = (workingDirectory: string): string =>
  join(workingDirectory, WEBCHAT_BOTONIC_PATH)

export const BOT_EXECUTOR_LAMBDA_NAME = 'botExecutor'
export const SENDER_LAMBDA_NAME = 'sender'
export const WEBSOCKET_ENDPOINT_PATH_NAME = 'ws'
export const REST_SERVER_ENDPOINT_PATH_NAME = 'api'
export const WSS_PROTOCOL_PREFIX = 'wss://'
export const HTTPS_PROTOCOL_PREFIX = 'https://'

export * from './pulumi-runner'
