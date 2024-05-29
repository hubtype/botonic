import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create custom events', () => {
  const requestData = getRequestData()
  test('should custom event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Custom,
      data: {
        customFields: {
          name: 'custom bot event',
          value: '12345',
        },
      },
    })

    expect(JSON.stringify(htEvent)).toBe(
      JSON.stringify({
        chat_id: 'chatIdTest',
        chat_language: 'es',
        chat_country: 'ES',
        format_version: 2,
        data: {
          action: EventAction.Custom,
          custom_fields: {
            name: 'custom bot event',
            value: '12345',
          },
        },
        type: EventType.WebEvent,
      })
    )
  })
})
