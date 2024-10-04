import { HubtypeSession } from '@botonic/core'

import { PluginHubtypeHelpdeskOptions, ProcessEnvNodeEnvs } from './types'

function getAccessTokenFromSession(session: HubtypeSession): string {
  if (!session._access_token) {
    throw new Error('No access token found in session')
  }
  return session._access_token
}

export function resolveGetAccessToken(
  options: PluginHubtypeHelpdeskOptions
): (session: HubtypeSession) => string {
  switch (process.env.NODE_ENV) {
    case ProcessEnvNodeEnvs.PRODUCTION:
      return getAccessTokenFromSession
    case ProcessEnvNodeEnvs.DEVELOPMENT:
      if (!options.accessToken)
        throw new Error('No access token found in plugin options')
      return () => options.accessToken
    default:
      throw new Error('No method defined for getting access token')
  }
}

export function getBotIdFromSession(session: HubtypeSession): string {
  if (!session.bot.id) {
    throw new Error('No bot id found in session')
  }
  return session.bot.id
}

export function resolveGetBotId(
  options: PluginHubtypeHelpdeskOptions
): (session: HubtypeSession) => string {
  switch (process.env.NODE_ENV) {
    case ProcessEnvNodeEnvs.PRODUCTION:
      return getBotIdFromSession
    case ProcessEnvNodeEnvs.DEVELOPMENT:
      if (!options.botId) throw new Error('No bot id found in plugin options')
      return () => options.botId
    default:
      throw new Error('No method defined for getting bot id')
  }
}
