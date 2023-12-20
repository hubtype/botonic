import { PROVIDER } from '@botonic/core'

export interface Event {
  chat: string
  event_type: EventName
  event_data: BaseEventData
}

export enum EventName {
  botAgentRating = 'bot_agent_rating',
  botChannelRating = 'bot_channel_rating',
  botFaqUseful = 'bot_faq_useful',
  botRating = 'bot_rating',
  botFaq = 'bot_faq',
  botStart = 'bot_start',
  botOpen = 'bot_open',
  botAiModel = 'bot_ai_model',
  botAiKnowledgeBase = 'bot_ai_knowledge_base',
  botKeywordsModel = 'bot_keywords_model',
  fallback = 'fallback',
  handoffOption = 'handoff_option',
  handoffSuccess = 'handoff_success',
  handoffFail = 'handoff_fail',
}
export interface BaseEventData {
  channel: string
  event_datetime: string
  enduser_language: string
  enduser_country?: string
  format_version?: number
  bot_version?: string
  flow_version?: string
}

export interface HtBaseEventProps {
  event_type: EventName
}

export interface EventAgentRating extends HtBaseEventProps {
  event_type: EventName.botAgentRating
  event_data: EventDataRating
}

export interface EventDataRating {
  case_id: string
  rating?: number
  comment?: string
}
export interface EventChannelRating extends HtBaseEventProps {
  event_type: EventName.botChannelRating
  event_data: EventDataChannelRating
}

export interface EventDataChannelRating {
  rating: number
}

export interface EventFaqUseful extends HtBaseEventProps {
  event_type: EventName.botFaqUseful
  event_data: EventDataUseful
}

export interface EventDataUseful {
  faq_name: string
  useful: boolean
}
export interface EventBotRating extends HtBaseEventProps {
  event_type: EventName.botRating
  event_data: EventDataBotRating
}

export interface EventDataBotRating {
  rating: number
  free_comment?: string
  selected_options?: string[]
}

export interface EventBotFaq extends HtBaseEventProps {
  event_type: EventName.botFaq
  event_data: EventDataBotFaq
}

export interface EventDataBotFaq {
  faq_name: string
}
export interface EventBotStart extends HtBaseEventProps {
  event_type: EventName.botStart
}

export interface EventBotOpen {
  event_type: EventName.botOpen
}

export interface EventBotAiModel {
  event_type: EventName.botAiModel
  event_data: EventDataBotAiModel
}

export interface EventDataBotAiModel {
  intent: string
  confidence: number
  confidence_successful: boolean
}

export interface EventBotAiKnowledgeBase {
  event_type: EventName.botAiKnowledgeBase
  event_data: EventDataBotAiKnowledgeBase
}

export interface EventDataBotAiKnowledgeBase {
  answer: string
  knowledge_source_ids: string[]
}

export interface EventBotKeywordModel extends HtBaseEventProps {
  event_type: EventName.botKeywordsModel
  event_data: EventDataBotKeywordModel
}

export interface EventDataBotKeywordModel {
  confidence_successful: boolean
}
export interface EventFallback extends HtBaseEventProps {
  event_type: EventName.fallback
}

export interface EventHandoffOption extends HtBaseEventProps {
  event_type: EventName.handoffOption
}

export interface EventHandoffSuccess extends HtBaseEventProps {
  event_type: EventName.handoffSuccess
  event_data: EventDataHandoff
}

export interface EventHandoffFail extends HtBaseEventProps {
  event_type: EventName.handoffFail
  event_data: EventDataHandoff
}

export interface EventDataHandoff {
  queue_open: boolean
  queue_id: string
  available_agents: boolean
  threshold_reached: boolean
}

export type HtEventProps =
  | EventAgentRating
  | EventChannelRating
  | EventFaqUseful
  | EventBotRating
  | EventBotFaq
  | EventBotStart
  | EventBotOpen
  | EventBotAiModel
  | EventBotAiKnowledgeBase
  | EventBotKeywordModel
  | EventFallback
  | EventHandoffOption
  | EventHandoffSuccess
  | EventHandoffFail

export interface RequestData {
  language: string
  country: string
  provider: PROVIDER
  userId: string
}
