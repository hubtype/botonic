import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create fallback events', () => {
  const requestData = getRequestData()
  test('The first fallback event is created', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.fallback,
      data: {
        fallbackAttempt: 1,
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
          action: EventAction.fallback,
          fallback_attempt: 1,
        },
        type: EventType.botevent,
      })
    )
  })

  test('The second fallback event is created', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.fallback,
      data: {
        fallbackAttempt: 2,
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
          action: EventAction.fallback,
          fallback_attempt: 2,
        },
        type: EventType.botevent,
      })
    )
  })

  test('The third fallback event is created', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.fallback,
      data: {
        fallbackAttempt: 1,
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
          action: EventAction.fallback,
          fallback_attempt: 1,
        },
        type: EventType.botevent,
      })
    )
  })
})
