import type { Session } from '@botonic/core'

import { ProcessEnvNodeEnvs } from '../types'

function getAccessTokenFromSession(session: Session): string {
  if (!session._access_token) {
    throw new Error('No access token found in session')
  }
  return session._access_token
}

export function resolveGetAccessToken(
  getAccessToken: (session: Session) => string
): (session: Session) => string {
  switch (process.env.NODE_ENV) {
    case ProcessEnvNodeEnvs.PRODUCTION:
      return getAccessTokenFromSession
    case ProcessEnvNodeEnvs.DEVELOPMENT:
      return getAccessToken
    default:
      throw new Error('No method defined for getting access token')
  }
}
