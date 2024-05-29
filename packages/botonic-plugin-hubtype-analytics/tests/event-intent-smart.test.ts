import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create nlu intent smart events', () => {
  const requestData = getRequestData()
  test('should create intent smart event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.IntentSmart,
      data: {
        nluIntentSmartTitle: 'ADD_A_BAG',
        nluIntentSmartNumUsed: 2,
        nluIntentSmartMessageId: 'messageId',
      },
    })

    expect(JSON.stringify(htEvent)).toBe(
      JSON.stringify({
        chat_id: 'chatIdTest',
        chat_language: 'es',
        chat_country: 'ES',
        format_version: 2,
        data: {
          action: EventAction.IntentSmart,
          nlu_intent_smart_title: 'ADD_A_BAG',
          nlu_intent_smart_num_used: 2,
          nlu_intent_smart_message_id: 'messageId',
        },
        type: EventType.Botevent,
      })
    )
  })
})
