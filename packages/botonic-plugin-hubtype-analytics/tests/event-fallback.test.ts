import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create fallback events', () => {
  const requestData = getRequestData()
  test('The first fallback event is created', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Fallback,
      fallbackOut: 1,
      fallbackMessageId: 'fallbackMessageIdTest',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.Fallback,
      fallback_out: 1,
      fallback_message_id: 'fallbackMessageIdTest',
      type: EventType.BotEvent,
    })
  })

  test('The second fallback event is created', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Fallback,
      fallbackOut: 2,
      fallbackMessageId: 'fallbackMessageIdTest',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.Fallback,
      fallback_out: 2,
      fallback_message_id: 'fallbackMessageIdTest',
      type: EventType.BotEvent,
    })
  })

  test('The third fallback event is created', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Fallback,
      fallbackOut: 1,
      fallbackMessageId: 'fallbackMessageIdTest',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.Fallback,
      fallback_out: 1,
      fallback_message_id: 'fallbackMessageIdTest',
      type: EventType.BotEvent,
    })
  })
})