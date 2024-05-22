import { createHtEvent, EventType, IntentClassicAction } from '../src'
import { getRequestData } from './helpers'

describe('Create nlu intent classic events', () => {
  const requestData = getRequestData()
  test('should create intent classic event', () => {
    const htEvent = createHtEvent(requestData, {
      action: IntentClassicAction.intentClassic,
      data: {
        nluIntentLabel: 'ADD_A_BAG',
        nluIntentId: 'nluIntentIdTest',
        nluIntentConfidence: 0.7,
        nluIntentThreshold: 0.6,
        nluIntentMessageId: 'nluIntentMessageId',
      },
    })

    expect(JSON.stringify(htEvent)).toBe(
      JSON.stringify({
        chat_id: 'chatIdTest',
        channel: 'webchat',
        created_at: htEvent.created_at,
        chat_language: 'es',
        chat_country: 'ES',
        format_version: 2,
        data: {
          action: IntentClassicAction.intentClassic,
          nlu_intent_label: 'ADD_A_BAG',
          nlu_intent_id: 'nluIntentIdTest',
          nlu_intent_confidence: 0.7,
          nlu_intent_threshold: 0.6,
          nlu_intent_message_id: 'nluIntentMessageId',
        },
        type: EventType.flow,
      })
    )
  })
})