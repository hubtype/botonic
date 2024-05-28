import {
  HtEvent,
  HtEventCustom,
  HtEventFallback,
  HtEventFeedback,
  HtEventFlow,
  HtEventHandoff,
  HtEventIntent,
  HtEventIntentSmart,
  HtEventKeyword,
  HtEventKnowledgeBase,
  HtEventWebview,
} from './event-models'
import { EventAction, HtEventProps, RequestData } from './types'

export function createHtEvent(
  requestData: RequestData,
  htEventProps: HtEventProps
): HtEvent {
  switch (htEventProps.action) {
    case EventAction.feedbackCase:
    case EventAction.feedbackConversation:
    case EventAction.feedbackMessage:
    case EventAction.feedbackWebview:
      return new HtEventFeedback(htEventProps, requestData)

    case EventAction.flowNode:
      return new HtEventFlow(htEventProps, requestData)

    case EventAction.handoffOption:
    case EventAction.handoffSuccess:
    case EventAction.handoffFail:
      return new HtEventHandoff(htEventProps, requestData)

    case EventAction.intent:
      return new HtEventIntent(htEventProps, requestData)

    case EventAction.keyword:
      return new HtEventKeyword(htEventProps, requestData)

    case EventAction.intentSmart:
      return new HtEventIntentSmart(htEventProps, requestData)

    case EventAction.knowledgebase:
      return new HtEventKnowledgeBase(htEventProps, requestData)

    case EventAction.fallback:
      return new HtEventFallback(htEventProps, requestData)

    case EventAction.webviewStep:
      return new HtEventWebview(htEventProps, requestData)

    case EventAction.customBot:
    case EventAction.customWeb:
      return new HtEventCustom(htEventProps, requestData)

    default:
      return new HtEvent(htEventProps, requestData)
  }
}
