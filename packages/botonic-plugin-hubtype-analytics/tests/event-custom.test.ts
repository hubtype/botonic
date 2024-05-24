import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create custom events', () => {
  const requestData = getRequestData()
  test('should custom bot event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.customBot,
      data: {
        custom_name: 'custom_bot',
        custom_value: '12345',
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
          action: EventAction.customBot,
          custom_name: 'custom_bot',
          custom_value: '12345',
        },
        type: EventType.botevent,
      })
    )
  })

  test('should custom web event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.customWeb,
      data: {
        custom_name: 'custom_bot',
        custom_value: '12345',
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
          action: EventAction.customWeb,
          custom_name: 'custom_bot',
          custom_value: '12345',
        },
        type: EventType.webevent,
      })
    )
  })
})
