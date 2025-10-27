import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create nlu intent smart events', () => {
  const requestData = getRequestData()
  test('should create intent smart event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.IntentSmart,
      nluIntentSmartTitle: 'ADD_A_BAG',
      nluIntentSmartNumUsed: 2,
      nluIntentSmartMessageId: 'messageId',
      userInput: 'Add a bag',
      flowThreadId: 'flowThreadId',
      flowId: 'flowId',
      flowName: 'flowName',
      flowNodeId: 'nluIntentSmartNodeId',
      flowNodeContentId: 'nluIntentSmartNodeContentId',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 4,
      action: EventAction.IntentSmart,
      nlu_intent_smart_title: 'ADD_A_BAG',
      nlu_intent_smart_num_used: 2,
      nlu_intent_smart_message_id: 'messageId',
      user_input: 'Add a bag',
      flow_thread_id: 'flowThreadId',
      flow_id: 'flowId',
      flow_name: 'flowName',
      flow_node_id: 'nluIntentSmartNodeId',
      flow_node_content_id: 'nluIntentSmartNodeContentId',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })
})
