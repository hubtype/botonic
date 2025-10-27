import {
  EventAction,
  EventAiAgent,
  EventCustom,
  EventFallback,
  EventFeedback,
  EventFeedbackKnowledgebase,
  EventFlow,
  EventFormatVersion,
  EventHandoff,
  EventHandoffOption,
  EventIntentSmart,
  EventKeyword,
  EventKnowledgeBase,
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
  | EventHandoff
  | EventHandoffOption
  | EventKeyword
  | EventIntentSmart
  | EventKnowledgeBase
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
  EventCustom,
  EventFallback,
  EventFeedback,
  EventFeedbackKnowledgebase,
  EventFlow,
  EventFormatVersion,
  EventHandoff,
  EventHandoffOption,
  EventIntentSmart,
  EventKeyword,
  EventKnowledgeBase,
  EventWebviewEnd,
  EventWebviewStep,
  KnowledgebaseFailReason,
  ToolExecution,
  WebviewEndFailType,
}
