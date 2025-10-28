import { INPUT, Input, Session } from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import { getFlowBuilderPlugin } from './helpers'
import { InShadowingConfig, ProcessEnvNodeEnvs } from './types'

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

export function getValueFromKeyPath(
  request: ActionRequest,
  keyPath: string
): any {
  if (keyPath.startsWith('input.') || keyPath.startsWith('session.')) {
    return keyPath
      .split('.')
      .reduce((object, key) => resolveObjectKey(object, key), request)
  }

  return keyPath
    .split('.')
    .reduce(
      (object, key) => resolveObjectKey(object, key),
      request.session.user.extra_data
    )
}

function resolveObjectKey(object: any, key: string): any {
  if (object && object[key] !== undefined) {
    return object[key]
  }
  return undefined
}

export function inputHasTextData(input: Input): boolean {
  return input.data !== undefined && input.type === INPUT.TEXT
}

function isNluAllowed(
  request: ActionRequest,
  nluFlag: keyof InShadowingConfig
): boolean {
  const shadowing = Boolean(request.session._shadowing)
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  return !shadowing || (shadowing && flowBuilderPlugin.inShadowing[nluFlag])
}

export function isKeywordsAllowed(request: ActionRequest): boolean {
  return isNluAllowed(request, 'allowKeywords')
}

export function isSmartIntentsAllowed(request: ActionRequest): boolean {
  return isNluAllowed(request, 'allowSmartIntents')
}

export function isKnowledgeBasesAllowed(request: ActionRequest): boolean {
  return isNluAllowed(request, 'allowKnowledgeBases')
}
