import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create custom events', () => {
  const requestData = getRequestData()
  test('should custom event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Custom,
      customFields: {
        name: 'custom bot event',
        value: '12345',
      },
      customSensitiveFields: {
        bank_account: '1234567890',
      },
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.Custom,
      custom_fields: {
        name: 'custom bot event',
        value: '12345',
      },
      custom_sensitive_fields: { bank_account: '1234567890' },
      bot_interaction_id: 'testInteractionId',
      type: EventType.WebEvent,
    })
  })
})
