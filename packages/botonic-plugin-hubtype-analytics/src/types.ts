import { PROVIDER } from '@botonic/core'

export interface Event {
  chat: string
  event_type: EventName
  event_data: BaseEventData
}

export enum EventName {
  feedback = 'feedback',
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
  type: EventName
}

export interface EventFeedback extends HtBaseEventProps {
  type: EventName.feedback
  data: EventPropsFeedback
}

export interface EventPropsFeedback {
  action: FeedbackAction
  messageGeneratedBy?: string
  feedbackTargetId?: string
  feedbackGroupId?: string
  possibleOptions: string[]
  possibleValues: number[]
  option: string
  value: number
}

export enum FeedbackAction {
  case = 'feedback_case',
  message = 'feddback_message',
  conversation = 'feddback_conversation',
  webview = 'feddback_webview',
}
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
  | EventFeedback
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
