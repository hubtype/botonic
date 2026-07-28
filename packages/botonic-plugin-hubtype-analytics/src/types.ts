import {
  AvailableSpecialist,
  EventAction,
  EventAiAgent,
  type EventAiAgentRouter,
  EventBotAction,
  EventCaptureUserInput,
  EventConditionalChannel,
  EventConditionalCountry,
  EventConditionalCustom,
  EventConditionalQueueStatus,
  EventCustom,
  EventFallback,
  EventFeedback,
  EventFlow,
  EventHandoff,
  EventHandoffOption,
  EventIntentSmart,
  EventKeyword,
  type EventRedirectFlow,
  EventWebviewActionTriggered,
  EventWebviewEnd,
  EventWebviewStep,
  ToolExecution,
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
  EventAiAgent,
  type EventAiAgentRouter,
  AvailableSpecialist,
  EventBotAction,
  EventCaptureUserInput,
  EventConditionalChannel,
  EventConditionalCountry,
  EventConditionalCustom,
  EventConditionalQueueStatus,
  EventCustom,
  EventFallback,
  EventFeedback,
  EventFlow,
  EventHandoff,
  EventHandoffOption,
  EventIntentSmart,
  EventKeyword,
  EventWebviewActionTriggered,
  EventWebviewEnd,
  EventWebviewStep,
  ToolExecution,
  WebviewEndFailType,
}
