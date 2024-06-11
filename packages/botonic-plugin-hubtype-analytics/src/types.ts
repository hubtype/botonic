export enum EventType {
  BotEvent = 'botevent',
  WebEvent = 'webevent',
}

export enum EventAction {
  FeedbackCase = 'feedback_case',
  FeedbackMessage = 'feedback_message',
  FeedbackConversation = 'feedback_conversation',
  FeedbackWebview = 'feedback_webview',
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
  messageGeneratedBy?: string
  feedbackTargetId?: string
  feedbackGroupId?: string
  possibleOptions: string[]
  possibleValues: number[]
  option: string
  value: number
  comment?: string
}

export interface EventFlow extends HtBaseEventProps {
  action: EventAction.FlowNode
  flowThreadId: string
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  flowNodeIsMeaningful?: boolean
}

export interface EventHandoff extends HtBaseEventProps {
  action: EventAction.HandoffSuccess | EventAction.HandoffFail
  queueId: string
  queueName: string
  caseId?: string
  isQueueOpen?: boolean
  isAvailableAgent?: boolean
  isThresholdReached?: boolean
}

export interface EventHandoffOption extends HtBaseEventProps {
  action: EventAction.HandoffOption
  queueId: string
  queueName: string
}

export interface EventIntent extends HtBaseEventProps {
  action: EventAction.Intent
  nluIntentLabel: string
  nluIntentConfidence: number
  nluIntentThreshold: number
  nluIntentMessageId: string
  userInput?: string
}

export interface EventKeyword extends HtBaseEventProps {
  action: EventAction.Keyword
  nluKeywordId: string
  nluKeywordName: string
  nluKeywordIsRegex?: boolean
  nluKeywordMessageId: string
  userInput?: string
}

export interface EventIntentSmart extends HtBaseEventProps {
  action: EventAction.IntentSmart
  nluIntentSmartTitle: string
  nluIntentSmartNumUsed: number
  nluIntentSmartMessageId: string
  userInput?: string
}

export interface EventKnowledgeBase extends HtBaseEventProps {
  action: EventAction.Knowledgebase
  knowledgebaseInferenceId: string
  knowledgebaseFailReason?: KnowledgebaseFailReason
  knowledgebaseSourcesIds: string[]
  knowledgebaseChunksIds: string[]
  knowledgebaseMessageId: string
  userInput?: string
}

export enum KnowledgebaseFailReason {
  NoKnowledge = 'no_knowledge',
  Hallucination = 'hallucination',
}

export interface EventFallback extends HtBaseEventProps {
  action: EventAction.Fallback
  fallbackOut: number
  fallbackMessageId: string
}

export interface EventWebview extends HtBaseEventProps {
  action: EventAction.WebviewStep | EventAction.WebviewEnd
  webviewThreadId: string
  webviewName: string
  webviewStepName?: string
  webviewEndFailType?: string
  webviewEndFailMessage?: string
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
  customFields: Record<string, any>
}

export type HtEventProps =
  | EventFeedback
  | EventFlow
  | EventHandoff
  | EventHandoffOption
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
  userId: string
}
