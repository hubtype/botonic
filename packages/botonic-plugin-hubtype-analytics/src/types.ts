import { PROVIDER } from '@botonic/core'

export enum EventName {
  feedback = 'feedback',
  flow = 'botevent',

  botOpen = 'bot_open',
  botAiModel = 'bot_ai_model',
  botAiKnowledgeBase = 'bot_ai_knowledge_base',
  botKeywordsModel = 'bot_keywords_model',
  fallback = 'fallback',
  handoffOption = 'handoff_option',
  handoffSuccess = 'handoff_success',
  handoffFail = 'handoff_fail',
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

export interface EventFlow extends HtBaseEventProps {
  type: EventName.flow
  data: EventPropsFlow
}

export interface EventPropsFlow {
  action: FlowAction
  flowThreadId: string
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  flowNodeIsMeaningful?: boolean
}

export enum FlowAction {
  flowNode = 'flow_node',
}

export interface EventBotOpen {
  type: EventName.botOpen
}

export interface EventBotAiModel {
  type: EventName.botAiModel
  data: EventDataBotAiModel
}

export interface EventDataBotAiModel {
  intent: string
  confidence: number
  confidence_successful: boolean
}

export interface EventBotAiKnowledgeBase {
  type: EventName.botAiKnowledgeBase
  data: EventDataBotAiKnowledgeBase
}

export interface EventDataBotAiKnowledgeBase {
  answer: string
  knowledge_source_ids: string[]
}

export interface EventBotKeywordModel extends HtBaseEventProps {
  type: EventName.botKeywordsModel
  data: EventDataBotKeywordModel
}

export interface EventDataBotKeywordModel {
  confidence_successful: boolean
}
export interface EventFallback extends HtBaseEventProps {
  type: EventName.fallback
}

export interface EventHandoffOption extends HtBaseEventProps {
  type: EventName.handoffOption
}

export interface EventHandoffSuccess extends HtBaseEventProps {
  type: EventName.handoffSuccess
  data: EventDataHandoff
}

export interface EventHandoffFail extends HtBaseEventProps {
  type: EventName.handoffFail
  data: EventDataHandoff
}

export interface EventDataHandoff {
  queue_open: boolean
  queue_id: string
  available_agents: boolean
  threshold_reached: boolean
}

export type HtEventProps = EventFeedback | EventFlow
// | EventBotStart
// | EventBotOpen
// | EventBotAiModel
// | EventBotAiKnowledgeBase
// | EventBotKeywordModel
// | EventFallback
// | EventHandoffOption
// | EventHandoffSuccess
// | EventHandoffFail

export interface RequestData {
  language: string
  country: string
  provider: PROVIDER
  userId: string
}
