import { INPUT, type Input } from '@botonic/core'
import type { ActionRequest } from '@botonic/react'

import type { InShadowingConfig } from '../types'
import { getFlowBuilderPlugin } from './get-flow-builder-plugin'

export function inputHasTextOrTranscript(input: Input): boolean {
  const isTextInput = Boolean(input.data) && input.type === INPUT.TEXT
  const isTranscriptText =
    Boolean(input.transcript) && input.type === INPUT.AUDIO

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
