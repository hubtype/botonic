import { PROVIDER } from '@botonic/core'

export enum EventType {
  Feedback = 'feedback',
  Botevent = 'botevent',
  Webevent = 'webevent',
}

export enum EventAction {
  FeedbackCase = 'feedback_case',
  FeedbackMessage = 'feddback_message',
  FeedbackConversation = 'feddback_conversation',
  FeedbackWebview = 'feddback_webview',
  FlowNode = 'flow_node',
  HandoffOption = 'handoff_option',
  HandoffSuccess = 'handoff_success',
  HandoffFail = 'handoff_fail',
  Keyword = 'nlu_keyword',
  Intent = 'nlu_intent',
  IntentSmart = 'nlu_intent_smart',
  Knowledgebase = 'knowledgebase',
  Fallback = 'fallback',
  WebviewStep = 'webview_step',
  WebviewEnd = 'webview_end',
  Custom = 'custom',
}

export interface HtBaseEventProps {
  action: EventAction
}

export interface EventFeedback extends HtBaseEventProps {
  action:
    | EventAction.FeedbackCase
    | EventAction.FeedbackConversation
    | EventAction.FeedbackMessage
    | EventAction.FeedbackWebview
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

export interface EventFlow extends HtBaseEventProps {
  action: EventAction.FlowNode
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

export interface EventHandoff extends HtBaseEventProps {
  action:
    | EventAction.HandoffOption
    | EventAction.HandoffSuccess
    | EventAction.HandoffFail
  data: EventPropsHandoff
}

export interface EventPropsHandoff {
  queueId: string
  queueName: string
  caseId?: string
  isQueueOpen?: boolean
  isAvailableAgent?: boolean
  isThresholdReached?: boolean
}

export interface EventIntent extends HtBaseEventProps {
  action: EventAction.Intent
  data: EventPropsIntent
}

export interface EventPropsIntent {
  nluIntentLabel: string
  nluIntentConfidence: number
  nluIntentThreshold: number
  nluIntentMessageId: string
}

export interface EventKeyword extends HtBaseEventProps {
  action: EventAction.Keyword
  data: EventPropsKeyword
}

export interface EventPropsKeyword {
  nluKeywordId: string
  nluKeywordName: string
  nluKeywordIsRegex?: boolean
  nluKeywordMessageId: string
}

export interface EventIntentSmart extends HtBaseEventProps {
  action: EventAction.IntentSmart
  data: EventPropsIntentSmart
}

export interface EventPropsIntentSmart {
  nluIntentSmartTitle: string
  nluIntentSmartNumUsed: number
  nluIntentSmartMessageId: string
}

export interface EventKnowledgeBase extends HtBaseEventProps {
  action: EventAction.Knowledgebase
  data: EventPropsKnowledgeBase
}

export interface EventPropsKnowledgeBase {
  knowledgebaseInferenceId: string
  knowledgebaseFailReason?: KnowledgebaseFailReason
  knowledgebaseSourcesIds: string[]
  knowledgebaseChunksIds: string[]
  knowledgebaseMessageId: string
}

export enum KnowledgebaseFailReason {
  NoKnowledge = 'no_knowledge',
  Hallucination = 'hallucination',
}

export interface EventFallback extends HtBaseEventProps {
  action: EventAction.Fallback
  data: EventPropsFallbackBase
}

export interface EventPropsFallbackBase {
  fallbackOut: number
  fallbackMessageId: string
}

export interface EventWebview extends HtBaseEventProps {
  action: EventAction.WebviewStep | EventAction.WebviewEnd
  data: EventPropsWebview
}

export interface EventPropsWebview {
  webviewThreadId: string
  webviewName: string
  webviewStepName?: string
  webviewEndFailType?: string
  webviewEndFailMessage?: string
}

export interface EventCustom extends HtBaseEventProps {
  action: EventAction.Custom
  data: EventPropsCustom
}

export interface EventPropsCustom {
  customFields: Record<string, any>
}

export type HtEventProps =
  | EventFeedback
  | EventFlow
  | EventHandoff
  | EventIntent
  | EventKeyword
  | EventIntentSmart
  | EventKnowledgeBase
  | EventFallback
  | EventWebview
  | EventCustom

export interface RequestData {
  language: string
  country: string
  provider: PROVIDER
  userId: string
}
