import { Session } from '@botonic/core'

import { BotonicPluginFlowBuilderOptions, ProcessEnvNodeEnvs } from './types'

function getAccessTokenFromSession(session: Session): string {
  if (!session._access_token) {
    throw new Error('No access token found in session')
  }
  return session._access_token
}

export function resolveGetAccessToken(
  options: BotonicPluginFlowBuilderOptions
): (session: Session) => string {
  switch (process.env.NODE_ENV) {
    case ProcessEnvNodeEnvs.PRODUCTION:
      return getAccessTokenFromSession
    case ProcessEnvNodeEnvs.DEVELOPMENT:
      return options.getAccessToken
    default:
      throw new Error('No method defined for getting access token')
  }
}

export function getValueFromKeyPath(extraData: any, keyPath: string): any {
  return keyPath
    .split('.')
    .reduce((object, key) => (object && object[key]) || undefined, extraData)
}
