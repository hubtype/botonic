import { Config } from '@pulumi/pulumi'
import { join } from 'path'
import { cwd } from 'process'

export function getNamePrefix(): string {
  const config = new Config()
  const prefix = generatePrefix(
    config.get('projectName') as string,
    config.get('stackName') as string
  )
  return prefix
}

export function generatePrefix(projectName: string, stackName: string): string {
  const SEPARATOR = '-'
  const prefix = `${projectName}${SEPARATOR}${stackName}`
  const MAX_LENGTH = 30
  if (prefix.length > MAX_LENGTH + 1) {
    throw new Error(
      `The combination of 'projectName' and 'stackName' names can not exceed ${MAX_LENGTH} chars.`
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
