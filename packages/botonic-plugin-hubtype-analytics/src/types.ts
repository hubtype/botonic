import {
  EventAction,
  EventAiAgent,
  EventBotAction,
  EventConditionalChannel,
  EventConditionalCountry,
  EventConditionalCustom,
  EventConditionalQueueStatus,
  EventCustom,
  EventFallback,
  EventFeedback,
  EventFeedbackKnowledgebase,
  EventFlow,
  EventHandoff,
  EventHandoffOption,
  EventIntentSmart,
  EventKeyword,
  EventKnowledgeBase,
  EventOpenWebview,
  EventWebviewEnd,
  EventWebviewStep,
  KnowledgebaseFailReason,
  ToolExecution,
  WebviewEndFailType,
} from '@botonic/core'

export enum EventType {
  BotEvent = 'botevent',
  WebEvent = 'webevent',
}

export type HtEventProps =
  | EventFeedback
  | EventFeedbackKnowledgebase
  | EventFlow
  | EventBotAction
  | EventConditionalChannel
  | EventConditionalCountry
  | EventConditionalCustom
  | EventConditionalQueueStatus
  | EventHandoff
  | EventHandoffOption
  | EventKeyword
  | EventIntentSmart
  | EventKnowledgeBase
  | EventOpenWebview
  | EventFallback
  | EventWebviewStep
  | EventWebviewEnd
  | EventCustom
  | EventAiAgent

export interface RequestData {
  userId?: string
  botInteractionId: string
  userLocale: string
  userCountry: string
  systemLocale: string
}

export {
  EventAction,
  EventAiAgent,
  EventBotAction,
  EventConditionalChannel,
  EventConditionalCountry,
  EventConditionalCustom,
  EventConditionalQueueStatus,
  EventCustom,
  EventFallback,
  EventFeedback,
  EventFeedbackKnowledgebase,
  EventFlow,
  EventHandoff,
  EventHandoffOption,
  EventIntentSmart,
  EventKeyword,
  EventKnowledgeBase,
  EventOpenWebview,
  EventWebviewEnd,
  EventWebviewStep,
  KnowledgebaseFailReason,
  ToolExecution,
  WebviewEndFailType,
}
