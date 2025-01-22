import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create nlu intent classic events', () => {
  const requestData = getRequestData()
  test('should create intent classic event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Intent,
      nluIntentLabel: 'ADD_A_BAG',
      nluIntentConfidence: 0.7,
      nluIntentThreshold: 0.6,
      nluIntentMessageId: 'nluIntentMessageId',
      userInput: 'Add a bag',
      flowThreadId: 'flowThreadId',
      flowId: 'flowId',
      flowNodeId: 'nluIntentNodeId',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.Intent,
      nlu_intent_label: 'ADD_A_BAG',
      nlu_intent_confidence: 0.7,
      nlu_intent_threshold: 0.6,
      nlu_intent_message_id: 'nluIntentMessageId',
      user_input: 'Add a bag',
      flow_thread_id: 'flowThreadId',
      flow_id: 'flowId',
      flow_node_id: 'nluIntentNodeId',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })
})
