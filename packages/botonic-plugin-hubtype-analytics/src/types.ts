export enum EventName {
  botAgentRating = 'bot_agent_rating',
  botChannelRating = 'bot_channel_rating',
  botFaqUseful = 'bot_faq_useful',
  botRating = 'bot_rating',
  botFaq = 'bot_faq',
  botStart = 'bot_start',
  botOpen = 'bot_open',
  botAiModel = 'bot_ai_model',
  botKeywordsModel = 'bot_keywords_model',
  fallback = 'fallback',
  handoffOption = 'handoff_option',
  handoffSuccess = 'handoff_success',
  handoffFail = 'handoff_fail',
}

interface EventData {
  enduser_country?: string
  enduser_language: string
  format_version?: number
  bot_version?: string
  flow_version?: string
}

export interface EventAgentRating {
  event_type: EventName.botAgentRating
  event_data: EventData & { rating: number }
}

export interface EventChannelRating {
  event_type: EventName.botChannelRating
  event_data: EventData & { rating: number }
}

export interface EventFaqUseful {
  event_type: EventName.botFaqUseful
  event_data: EventData & { faq_name: string; useful: boolean }
}

export interface EventBotRating {
  event_type: EventName.botRating
  event_data: EventData & {
    faq_name: string
    useful: boolean
    rating: number
    free_comment: string
    selected_options: string[]
  }
}

export interface EventBotFaq {
  event_type: EventName.botFaq
  event_data: EventData & { faq_name: string }
}

export interface EventBotStart {
  event_type: EventName.botStart
  event_data: EventData
}

export interface EventBotOpen {
  event_type: EventName.botOpen
  event_data: EventData
}

export interface EventBotAiModel {
  event_type: EventName.botAiModel
  event_data: EventData & {
    intent: string
    confidence: number
    confidence_successful: boolean
  }
}

export interface EventBotKeywordModel {
  event_type: EventName.botKeywordsModel
  event_data: EventData & {
    confidence_successful: boolean
  }
}

export interface EventFallback {
  event_type: EventName.fallback
  event_data: EventData
}

export interface EventHandoffOption {
  event_type: EventName.handoffOption
  event_data: EventData
}

export interface EventHandoffSuccess {
  event_type: EventName.handoffSuccess
  event_data: EventData & {
    queue_open: boolean
    available_agents: boolean
    threshold_reached: boolean
  }
}

export interface EventHandoffFail {
  event_type: EventName.handoffFail
  event_data: EventData & {
    queue_open: boolean
    available_agents: boolean
    threshold_reached: boolean
  }
}

export type HtEvent =
  | EventAgentRating
  | EventChannelRating
  | EventFaqUseful
  | EventBotRating
  | EventBotFaq
  | EventBotStart
  | EventBotOpen
  | EventBotAiModel
  | EventBotKeywordModel
  | EventFallback
  | EventHandoffOption
  | EventHandoffSuccess
  | EventHandoffFail
