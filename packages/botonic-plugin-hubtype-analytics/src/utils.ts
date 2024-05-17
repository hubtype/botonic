import { HtEvent, HtEventFeedback, HtEventFlow } from './event-models'
// import { HtEventBotAiModel } from './event-models/ht-event-bot-ai-model'
// import { HtEventBotKeywordModel } from './event-models/ht-event-bot-keyword-model'
// import { HtEventBotAiKnowledgeBase } from './event-models/ht-event-bot-knowledge-base'
// import { HtEventHandoffFail } from './event-models/ht-event-handoff-fail'
// import { HtEventHandoffSuccess } from './event-models/ht-event-handoff-success'
import { FeedbackAction, FlowAction, HtEventProps, RequestData } from './types'

export function createHtEvent(
  requestData: RequestData,
  htEventProps: HtEventProps
): HtEvent {
  switch (htEventProps.data.action) {
    case FeedbackAction.case:
    case FeedbackAction.conversation:
    case FeedbackAction.message:
    case FeedbackAction.webview:
      return new HtEventFeedback(htEventProps, requestData)

    case FlowAction.flowNode:
      return new HtEventFlow(htEventProps, requestData)

    // case EventName.botAiModel:
    //   return new HtEventBotAiModel(htEventProps, requestData)

    // case EventName.botAiKnowledgeBase:
    //   return new HtEventBotAiKnowledgeBase(htEventProps, requestData)

    // case EventName.botKeywordsModel:
    //   return new HtEventBotKeywordModel(htEventProps, requestData)

    // case EventName.handoffSuccess:
    //   return new HtEventHandoffSuccess(htEventProps, requestData)

    // case EventName.handoffFail:
    //   return new HtEventHandoffFail(htEventProps, requestData)

    default:
      return new HtEvent(htEventProps, requestData)
  }
}
