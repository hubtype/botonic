import { PluginPreRequest, Session } from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import { HtFlowBuilderData } from './content-fields/hubtype-fields'

export interface BotonicPluginFlowBuilderOptions {
  apiUrl?: string
  jsonVersion?: FlowBuilderJSONVersion
  flow?: HtFlowBuilderData
  customFunctions?: Record<any, any>
  getLocale: (session: Session) => string
  getAccessToken: () => string
  trackEvent?: (
    request: ActionRequest,
    eventAction: string,
    args?: Record<string, any>
  ) => Promise<void>
  getKnowledgeBaseResponse?: (
    request: ActionRequest,
    userInput: string,
    sources: string[]
  ) => Promise<KnowledgeBaseResponse>
  smartIntentsConfig?: { numSmartIntentsToUse: number }
}

export interface FlowBuilderApiOptions {
  url: string
  flow?: HtFlowBuilderData
  accessToken: string
  request: PluginPreRequest
}

export enum ProcessEnvNodeEnvs {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export enum FlowBuilderJSONVersion {
  DRAFT = 'draft',
  LATEST = 'latest',
}

export interface KnowledgeBaseResponse {
  inferenceId: string
  question: string
  answer: string
  hasKnowledge: boolean
  isFaithuful: boolean
  sources: {
    knowledgeBaseId: string
    knowledgeSourceId: string
    knowledgeChunkId: string
  }[]
}

export interface SmartIntentResponse {
  data: {
    smart_intent_title: string
    text: string
    smart_intents_used: {
      title: string
      description: string
    }[]
  }
}

export interface PayloadParamsBase {
  followUpContentID?: string
}
