import { PROVIDER } from '@botonic/core'

export enum EventType {
  feedback = 'feedback',
  flow = 'botevent',
}

export enum EventAction {
  feedbackCase = 'feedback_case',
  feedbackMessage = 'feddback_message',
  feedbackConversation = 'feddback_conversation',
  feedbackWebview = 'feddback_webview',
  flowNode = 'flow_node',
  handoffOption = 'handoff_option',
  handoffSuccess = 'handoff_success',
  handoffFail = 'handoff_fail',
  intentClassic = 'nlu_intent_classic',
  keyword = 'nlu_keyword',
  intentSmart = 'nlu_intent_smart',
  knowledgebase = 'knowledgebase',
}

export interface HtBaseEventProps {
  action: EventAction
}

export interface EventFeedback extends HtBaseEventProps {
  action:
    | EventAction.feedbackCase
    | EventAction.feedbackConversation
    | EventAction.feedbackMessage
    | EventAction.feedbackWebview
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
  action: EventAction.flowNode
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
    | EventAction.handoffOption
    | EventAction.handoffSuccess
    | EventAction.handoffFail
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

export interface EventIntentClassic extends HtBaseEventProps {
  action: EventAction.intentClassic
  data: EventPropsIntentClassic
}

export interface EventPropsIntentClassic {
  nluIntentLabel: string
  nluIntentId: string
  nluIntentConfidence: number
  nluIntentThreshold: number
  nluIntentMessageId: string
}

export interface EventKeyword extends HtBaseEventProps {
  action: EventAction.keyword
  data: EventPropsKeyword
}

export interface EventPropsKeyword {
  nluKeywordId: string
  nluKeywordName: string
  nluKeywordIsRegex?: boolean
  nluKeywordMessageId: string
}

export interface EventIntentSmart extends HtBaseEventProps {
  action: EventAction.intentSmart
  data: EventPropsIntentSmart
}

export interface EventPropsIntentSmart {
  nluIntentSmartLabel: string
  nluIntentSmartNumUsed: number
  nluIntentSmartMessageId: string
}

export interface EventKnowledgeBase extends HtBaseEventProps {
  action: EventAction.knowledgebase
  data: EventPropsKnowledgeBase
}

export interface EventPropsKnowledgeBase {
  knowledgebaseId: string
  knowledgebaseFailReason: string
  knowledgebaseSourcesIds: string[]
  knowledgebaseChunksIds: string[]
}

export type HtEventProps =
  | EventFeedback
  | EventFlow
  | EventHandoff
  | EventIntentClassic
  | EventKeyword
  | EventIntentSmart
  | EventKnowledgeBase

export interface RequestData {
  language: string
  country: string
  provider: PROVIDER
  userId: string
}
