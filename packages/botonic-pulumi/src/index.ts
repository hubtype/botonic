import { Config } from '@pulumi/pulumi'
import { join } from 'path'
import { cwd } from 'process'

export const PROJECT_NAME_SEPARATOR = '-'
export const MAX_PROJECT_NAME_LENGTH = 30

export function getNamePrefix(): string {
  const config = new Config()
  return generatePrefix(
    config.get('projectName') as string,
    config.get('stackName') as string
  )
}

export function generatePrefix(projectName: string, stackName: string): string {
  const prefix = `${projectName}${PROJECT_NAME_SEPARATOR}${stackName}`
  if (prefix.length > MAX_PROJECT_NAME_LENGTH + PROJECT_NAME_SEPARATOR.length) {
    throw new Error(
      `The combination of 'projectName' and 'stackName' names can not exceed ${MAX_PROJECT_NAME_LENGTH} chars.`
    )
  }
  return prefix
}

export const NLP_MODELS_PATH = join(cwd(), 'bot', 'src', 'nlp', 'tasks')
export const WEBSOCKET_SERVER_PATH = join(cwd(), 'api', 'dist', 'websocket')
export const REST_SERVER_PATH = join(cwd(), 'api', 'dist', 'rest')
export const WEBCHAT_CONTENTS_PATH = join(cwd(), 'webchat', 'dist')
export const WEBSOCKET_ENDPOINT_PATH_NAME = 'ws'
export const REST_SERVER_ENDPOINT_PATH_NAME = 'api'

export const WEBCHAT_BOTONIC_PATH = join(
  process.cwd(),
  'webchat',
  'dist',
  'webchat.botonic.js'
)

export * from './pulumi-runner'
