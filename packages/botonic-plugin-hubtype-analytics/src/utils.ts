/* eslint-disable complexity */
import {
  HtEvent,
  HtEventAiAgent,
  HtEventBotAction,
  HtEventConditionalChannel,
  HtEventConditionalCountry,
  HtEventConditionalCustom,
  HtEventConditionalQueueStatus,
  HtEventCustom,
  HtEventFallback,
  HtEventFeedback,
  HtEventFeedbackKnowledgebase,
  HtEventFlow,
  HtEventHandoff,
  HtEventHandoffOption,
  HtEventIntentSmart,
  HtEventKeyword,
  HtEventKnowledgeBase,
  HtEventOpenWebview,
  HtEventWebviewEnd,
  HtEventWebviewStep,
} from './event-models'
import { EventAction, HtEventProps, RequestData } from './types'

export function createHtEvent(
  requestData: RequestData,
  htEventProps: HtEventProps
): HtEvent {
  switch (htEventProps.action) {
    case EventAction.FeedbackCase:
    case EventAction.FeedbackConversation:
    case EventAction.FeedbackMessage:
    case EventAction.FeedbackWebview:
      return new HtEventFeedback(htEventProps, requestData)

    case EventAction.FeedbackKnowledgebase:
      return new HtEventFeedbackKnowledgebase(htEventProps, requestData)

    case EventAction.FlowNode:
      return new HtEventFlow(htEventProps, requestData)

    case EventAction.HandoffOption:
      return new HtEventHandoffOption(htEventProps, requestData)

    case EventAction.HandoffSuccess:
    case EventAction.HandoffFail:
      return new HtEventHandoff(htEventProps, requestData)

    case EventAction.Keyword:
      return new HtEventKeyword(htEventProps, requestData)

    case EventAction.IntentSmart:
      return new HtEventIntentSmart(htEventProps, requestData)

    case EventAction.Knowledgebase:
      return new HtEventKnowledgeBase(htEventProps, requestData)

    case EventAction.Fallback:
      return new HtEventFallback(htEventProps, requestData)

    case EventAction.WebviewStep:
      return new HtEventWebviewStep(htEventProps, requestData)

    case EventAction.WebviewEnd:
      return new HtEventWebviewEnd(htEventProps, requestData)

    case EventAction.Custom:
      return new HtEventCustom(htEventProps, requestData)

    case EventAction.AiAgent:
      return new HtEventAiAgent(htEventProps, requestData)

    case EventAction.ConditionalCountry:
      return new HtEventConditionalCountry(htEventProps, requestData)

    case EventAction.ConditionalQueueStatus:
      return new HtEventConditionalQueueStatus(htEventProps, requestData)

    case EventAction.ConditionalCustom:
      return new HtEventConditionalCustom(htEventProps, requestData)

    case EventAction.ConditionalChannel:
      return new HtEventConditionalChannel(htEventProps, requestData)

    case EventAction.BotAction:
      return new HtEventBotAction(htEventProps, requestData)

    case EventAction.OpenWebview:
      return new HtEventOpenWebview(htEventProps, requestData)

    default:
      return new HtEvent(htEventProps, requestData)
  }
}
