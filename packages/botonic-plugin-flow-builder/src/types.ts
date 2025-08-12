import { BotContext, PluginPreRequest, ResolvedPlugins } from '@botonic/core'

import { FlowContent } from './content-fields'
import { HtFlowBuilderData } from './content-fields/hubtype-fields'

export interface InShadowingConfig {
  allowKeywords: boolean
  allowSmartIntents: boolean
  allowKnowledgeBases: boolean
}

export interface BotonicPluginFlowBuilderOptions<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> {
  apiUrl?: string
  jsonVersion?: FlowBuilderJSONVersion
  flow?: HtFlowBuilderData
  customFunctions?: Record<any, any>
  getAccessToken: () => string
  trackEvent?: TrackEventFunction<TPlugins, TExtraData>
  getKnowledgeBaseResponse?: KnowledgeBaseFunction<TPlugins, TExtraData>
  getAiAgentResponse?: AiAgentFunction<TPlugins, TExtraData>
  smartIntentsConfig?: { numSmartIntentsToUse: number }
  inShadowing?: Partial<InShadowingConfig>
  contentFilters?: ContentFilter<TPlugins, TExtraData>[]
  customRatingMessageEnabled?: boolean
}

export type TrackEventFunction<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> = (
  request: BotContext<TPlugins, TExtraData>,
  eventAction: string,
  args?: Record<string, any>
) => Promise<void>

export type KnowledgeBaseFunction<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> = (
  request: BotContext<TPlugins, TExtraData>,
  sources: string[],
  instructions: string,
  messageId: string,
  memoryLength: number
) => Promise<KnowledgeBaseResponse>

export type AiAgentFunction<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> = (
  request: BotContext<TPlugins, TExtraData>,
  aiAgentArgs: AiAgentArgs
) => Promise<InferenceResponse>

export interface GuardrailRule {
  name: string
  description: string
}

export interface AiAgentArgs {
  name: string
  instructions: string
  activeTools?: { name: string }[]
  inputGuardrailRules?: GuardrailRule[]
}
export type ContentFilter<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> = (
  request: BotContext<TPlugins, TExtraData>,
  content: FlowContent
) => Promise<FlowContent> | FlowContent

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

export interface OutputBaseMessage {
  type: 'text' | 'textWithButtons' | 'carousel' | 'exit'
}

export interface TextMessage extends OutputBaseMessage {
  type: 'text'
  content: {
    text: string
  }
}

export interface TextWithButtonsMessage extends OutputBaseMessage {
  type: 'textWithButtons'
  content: {
    text: string
    buttons: string[]
  }
}

export interface CarouselMessage extends OutputBaseMessage {
  type: 'carousel'
  content: {
    elements: {
      title: string
      subtitle: string
      image: string
      button: { text: string; url: string }
    }[]
  }
}

export type AgenticOutputMessage =
  | TextMessage
  | TextWithButtonsMessage
  | CarouselMessage

export interface InferenceResponse {
  messages: AgenticOutputMessage[]
  toolsExecuted: string[]
  exit: boolean
  inputGuardrailTriggered: boolean
  outputGuardrailTriggered: boolean
}
