import {
  EventAction,
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
  EventWebviewEnd,
  EventWebviewStep,
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

export interface RequestData {
  userId?: string
  botInteractionId: string
  userLocale: string
  userCountry: string
  systemLocale: string
}

export {
  EventAction,
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
  EventWebviewEnd,
  EventWebviewStep,
}
