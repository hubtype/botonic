import {
  EventAction,
  EventAiAgent,
  EventBotAction,
  EventCaptureUserInput,
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
  EventRedirectFlow,
  EventWebviewActionTriggered,
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
  | EventWebviewActionTriggered
  | EventFallback
  | EventWebviewStep
  | EventWebviewEnd
  | EventCustom
  | EventAiAgent
  | EventRedirectFlow
  | EventCaptureUserInput

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
  EventCaptureUserInput,
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
  EventWebviewActionTriggered,
  EventWebviewEnd,
  EventWebviewStep,
  KnowledgebaseFailReason,
  ToolExecution,
  WebviewEndFailType,
}
