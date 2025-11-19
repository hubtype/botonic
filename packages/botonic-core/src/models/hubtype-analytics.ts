import { ToolExecution } from './ai-agents'

export const EVENT_FORMAT_VERSION = 5

export enum EventAction {
  AiAgent = 'ai_agent',
  FeedbackCase = 'feedback_case',
  FeedbackMessage = 'feedback_message',
  FeedbackConversation = 'feedback_conversation',
  FeedbackKnowledgebase = 'feedback_knowledgebase',
  FeedbackWebview = 'feedback_webview',
  FlowNode = 'flow_node',
  ConditionalCountry = 'conditional_country',
  ConditionalQueueStatus = 'conditional_queue_status',
  ConditionalCustom = 'conditional_custom',
  ConditionalChannel = 'conditional_channel',
  BotAction = 'bot_action',
  WebviewActionTriggered = 'webview_action_triggered',
  HandoffOption = 'handoff_option',
  HandoffSuccess = 'handoff_success',
  HandoffFail = 'handoff_fail',
  Keyword = 'nlu_keyword',
  IntentSmart = 'nlu_intent_smart',
  Knowledgebase = 'knowledgebase',
  Fallback = 'fallback',
  WebviewStep = 'webview_step',
  WebviewEnd = 'webview_end',
  Custom = 'custom',
  RedirectFlow = 'redirect_flow',
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
  feedbackTargetId: string
  feedbackGroupId: string
  possibleOptions: string[]
  possibleValues?: number[]
  option: string
  value?: number
  comment?: string
}

export interface EventFeedbackKnowledgebase extends HtBaseEventProps {
  action: EventAction.FeedbackKnowledgebase
  knowledgebaseInferenceId: string
  feedbackBotInteractionId: string
  feedbackTargetId: string
  feedbackGroupId: string
  possibleOptions: string[]
  possibleValues?: number[]
  option: string
  value?: number
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

export interface EventBotAction extends HtBaseEventProps {
  action: EventAction.BotAction
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  payload: string
}

export interface EventConditionalCountry extends HtBaseEventProps {
  action: EventAction.ConditionalCountry
  flowThreadId: string
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  country: string
}

export interface EventConditionalQueueStatus extends HtBaseEventProps {
  action: EventAction.ConditionalQueueStatus
  flowThreadId: string
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  queueId: string
  queueName: string
  isQueueOpen: boolean
  isAvailableAgent: boolean
}

export interface EventConditionalCustom extends HtBaseEventProps {
  action: EventAction.ConditionalCustom
  flowThreadId: string
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  conditionalVariable: string
  variableFormat: string
}

export interface EventConditionalChannel extends HtBaseEventProps {
  action: EventAction.ConditionalChannel
  flowThreadId: string
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  channel: string
}

export interface EventHandoff extends HtBaseEventProps {
  action: EventAction.HandoffSuccess | EventAction.HandoffFail
  flowThreadId?: string
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  queueId: string
  queueName: string
  caseId?: string
  isQueueOpen?: boolean
  isAvailableAgent?: boolean
  isThresholdReached?: boolean
  handoffNoteId?: string
  handoffHasAutoAssign: boolean
}

export interface EventHandoffOption extends HtBaseEventProps {
  action: EventAction.HandoffOption
  flowThreadId?: string
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  queueId?: string
  queueName?: string
}

export interface EventKeyword extends HtBaseEventProps {
  action: EventAction.Keyword
  flowThreadId: string
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  nluKeywordName: string
  nluKeywordIsRegex?: boolean
  nluKeywordMessageId: string
  userInput: string
}

export interface EventIntentSmart extends HtBaseEventProps {
  action: EventAction.IntentSmart
  flowThreadId: string
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  nluIntentSmartTitle: string
  nluIntentSmartNumUsed: number
  nluIntentSmartMessageId: string
  userInput: string
}

export interface EventKnowledgeBase extends HtBaseEventProps {
  action: EventAction.Knowledgebase
  flowThreadId: string
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  knowledgebaseInferenceId: string
  knowledgebaseFailReason?: KnowledgebaseFailReason
  knowledgebaseSourcesIds: string[]
  knowledgebaseChunksIds: string[]
  knowledgebaseMessageId: string
  userInput: string
}

export interface EventWebviewActionTriggered extends HtBaseEventProps {
  action: EventAction.WebviewActionTriggered
  flowThreadId: string
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  webviewTargetId: string
  webviewName: string
}

export interface EventAiAgent extends HtBaseEventProps {
  action: EventAction.AiAgent
  flowThreadId: string
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  flowNodeIsMeaningful: boolean
  toolsExecuted: ToolExecution[]
  inputMessageId: string
  memoryLength: number
  inputGuardrailsTriggered: string[]
  outputGuardrailsTriggered: string[]
  exit: boolean
  error: boolean
}

export interface EventRedirectFlow extends HtBaseEventProps {
  action: EventAction.RedirectFlow
  flowThreadId: string
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  flowTargetId: string
  flowTargetName: string
}

export enum KnowledgebaseFailReason {
  NoKnowledge = 'no_knowledge',
  Hallucination = 'hallucination',
}

export interface EventFallback extends HtBaseEventProps {
  action: EventAction.Fallback
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  userInput: string
  fallbackOut: number
  fallbackMessageId: string
}

export interface EventWebviewStep extends HtBaseEventProps {
  action: EventAction.WebviewStep
  flowThreadId?: string
  webviewThreadId: string
  webviewName: string
  webviewStepName: string
  webviewStepNumber: number
}

export interface EventWebviewEnd extends HtBaseEventProps {
  action: EventAction.WebviewEnd
  flowThreadId?: string
  webviewThreadId: string
  webviewName: string
  webviewStepName?: string
  webviewStepNumber?: number
  webviewEndFailType?: WebviewEndFailType
  webviewEndFailMessage?: string
}

export enum WebviewEndFailType {
  CanceledByUser = 'canceled_by_user',
  ApiError = 'api_error',
  NeedsEscalation = 'needs_escalation',
}

export interface EventCustom extends HtBaseEventProps {
  action: EventAction.Custom
  customFields?: Record<string, any>
  customSensitiveFields?: Record<string, any>
}
