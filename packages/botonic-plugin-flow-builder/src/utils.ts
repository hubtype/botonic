import { INPUT, type Input, type Session } from '@botonic/core'
import type { ActionRequest } from '@botonic/react'

import { getFlowBuilderPlugin } from './helpers'
import { type InShadowingConfig, ProcessEnvNodeEnvs } from './types'

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

export function inputHasTextOrTranscript(input: Input): boolean {
  const isTextInput = input.data !== undefined && input.type === INPUT.TEXT
  const isTranscriptText = input.transcript !== undefined && input.type === INPUT.AUDIO

  return isTextInput || isTranscriptText
}

export function getTextOrTranscript(input: Input): string | undefined {
  if (input.type === INPUT.TEXT && input.data) {
    return input.data
  }
  if (input.type === INPUT.AUDIO && input.transcript) {
    return input.transcript
  }

  console.error('No text or transcript found in input', input)
  return undefined
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
