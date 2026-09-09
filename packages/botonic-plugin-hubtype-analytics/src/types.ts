import {
  type AvailableSpecialist,
  EventAction,
  type EventAiAgent,
  type EventAiAgentRouter,
  type EventBotAction,
  type EventCaptureUserInput,
  type EventConditionalChannel,
  type EventConditionalCountry,
  type EventConditionalCustom,
  type EventConditionalQueueStatus,
  type EventCustom,
  type EventFallback,
  type EventFeedback,
  type EventFlow,
  type EventHandoff,
  type EventHandoffOption,
  type EventIntentSmart,
  type EventKeyword,
  type EventRedirectFlow,
  type EventWebviewActionTriggered,
  type EventWebviewEnd,
  type EventWebviewStep,
  type ToolExecution,
  WebviewEndFailType,
} from '@botonic/core'

export enum EventType {
  BotEvent = 'botevent',
  WebEvent = 'webevent',
}

export type HtEventProps =
  | EventFeedback
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
  | EventWebviewActionTriggered
  | EventFallback
  | EventWebviewStep
  | EventWebviewEnd
  | EventCustom
  | EventAiAgent
  | EventAiAgentRouter
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
  type EventAiAgent,
  type EventAiAgentRouter,
  type AvailableSpecialist,
  type EventBotAction,
  type EventCaptureUserInput,
  type EventConditionalChannel,
  type EventConditionalCountry,
  type EventConditionalCustom,
  type EventConditionalQueueStatus,
  type EventCustom,
  type EventFallback,
  type EventFeedback,
  type EventFlow,
  type EventHandoff,
  type EventHandoffOption,
  type EventIntentSmart,
  type EventKeyword,
  type EventWebviewActionTriggered,
  type EventWebviewEnd,
  type EventWebviewStep,
  type ToolExecution,
  WebviewEndFailType,
}
