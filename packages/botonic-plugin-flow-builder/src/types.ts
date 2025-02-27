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
  trackEvent?: TrackEventFunction
  getKnowledgeBaseResponse?: KnowledgeBaseFunction
  smartIntentsConfig?: { numSmartIntentsToUse: number }
}

export type TrackEventFunction = (
  request: ActionRequest,
  eventAction: string,
  args?: Record<string, any>
) => Promise<void>

export type KnowledgeBaseFunction = (
  request: ActionRequest,
  sources: string[],
  instructions: string,
  messageId: string,
  memoryLength: number
) => Promise<KnowledgeBaseResponse>

export interface FlowBuilderApiOptions {
  url: string
  flowUrl: string
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
  hasKnowledge: boolean
  isFaithful: boolean
  chunkIds: string[]
  answer: string
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
