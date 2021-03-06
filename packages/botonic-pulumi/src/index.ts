import { Config } from '@pulumi/pulumi'
import { join } from 'path'
import { cwd } from 'process'

export const getNamePrefix = (): string => {
  const config = new Config()
  return `botonic-${config.get('projectName')}-${config.get('stackName')}`
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
