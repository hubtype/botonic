import { join } from 'path'

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
