import {
  BotContext,
  PluginPreRequest,
  ResolvedPlugins,
  Session,
} from '@botonic/core'

import { HtFlowBuilderData } from './content-fields/hubtype-fields'

export interface InShadowingConfig {
  allowKeywords: boolean
  allowSmartIntents: boolean
  allowKnowledgeBases: boolean
}

export interface BotonicPluginFlowBuilderOptions<T extends ResolvedPlugins> {
  apiUrl?: string
  jsonVersion?: FlowBuilderJSONVersion
  flow?: HtFlowBuilderData
  customFunctions?: Record<any, any>
  getLocale: (session: Session) => string
  getAccessToken: () => string
  trackEvent?: TrackEventFunction<T>
  getKnowledgeBaseResponse?: KnowledgeBaseFunction<T>
  smartIntentsConfig?: { numSmartIntentsToUse: number }
  inShadowing?: Partial<InShadowingConfig>
}

export type TrackEventFunction<T extends ResolvedPlugins = ResolvedPlugins> = (
  request: BotContext<T>,
  eventAction: string,
  args?: Record<string, any>
) => Promise<void>

export type KnowledgeBaseFunction<T extends ResolvedPlugins = ResolvedPlugins> =
  (
    request: BotContext<T>,
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
