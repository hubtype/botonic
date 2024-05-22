import { PROVIDER } from '@botonic/core'

export enum EventName {
  feedback = 'feedback',
  flow = 'botevent',

  botOpen = 'bot_open',
  botAiModel = 'bot_ai_model',
  botAiKnowledgeBase = 'bot_ai_knowledge_base',
  botKeywordsModel = 'bot_keywords_model',
  fallback = 'fallback',
}

export type EventAction = FeedbackAction | FlowAction | HandoffAction

export interface HtBaseEventProps {
  action: EventAction
}

export interface EventFeedback extends HtBaseEventProps {
  action: FeedbackAction
  data: EventPropsFeedback
}

export interface EventPropsFeedback {
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
  action: FlowAction
  data: EventPropsFlow
}

export interface EventPropsFlow {
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

export interface EventHandoff extends HtBaseEventProps {
  action: HandoffAction
  data: EventPropsHandoff
}

export interface EventPropsHandoff {
  handoffQueueId: string
  handoffQueueName: string
  handoffCaseId?: string
  isQueueOpen?: boolean
  handoffIsAvailableAgent?: boolean
  handoffIsThresholdReached?: boolean
}

export enum HandoffAction {
  handoffOption = 'handoff_option',
  handoffSuccess = 'handoff_success',
  handoffFail = 'handoff_fail',
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

export type HtEventProps = EventFeedback | EventFlow | EventHandoff
// | EventBotStart
// | EventBotOpen
// | EventBotAiModel
// | EventBotAiKnowledgeBase
// | EventBotKeywordModel
// | EventFallback

export interface RequestData {
  language: string
  country: string
  provider: PROVIDER
  userId: string
}
