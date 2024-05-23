import {
  HtEvent,
  HtEventFeedback,
  HtEventFlow,
  HtEventHandoff,
  HtEventIntentClassic,
  HtEventIntentSmart,
  HtEventKeyword,
} from './event-models'
import {
  FeedbackAction,
  FlowAction,
  HandoffAction,
  HtEventProps,
  IntentClassicAction,
  IntentSmartAction,
  KeywordAction,
  RequestData,
} from './types'

export function createHtEvent(
  requestData: RequestData,
  htEventProps: HtEventProps
): HtEvent {
  switch (htEventProps.action) {
    case FeedbackAction.case:
    case FeedbackAction.conversation:
    case FeedbackAction.message:
    case FeedbackAction.webview:
      return new HtEventFeedback(htEventProps, requestData)

    case FlowAction.flowNode:
      return new HtEventFlow(htEventProps, requestData)

    case HandoffAction.handoffOption:
    case HandoffAction.handoffSuccess:
    case HandoffAction.handoffFail:
      return new HtEventHandoff(htEventProps, requestData)

    case IntentClassicAction.intentClassic:
      return new HtEventIntentClassic(htEventProps, requestData)

    case KeywordAction.keyword:
      return new HtEventKeyword(htEventProps, requestData)

    case IntentSmartAction.intentSmart:
      return new HtEventIntentSmart(htEventProps, requestData)

    // case EventName.botAiKnowledgeBase:
    //   return new HtEventBotAiKnowledgeBase(htEventProps, requestData)

    default:
      return new HtEvent(htEventProps, requestData)
  }
}
