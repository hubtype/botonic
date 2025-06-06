import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create fallback events', () => {
  const requestData = getRequestData()
  test('The first fallback event is created', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Fallback,
      userInput: 'userInputTest',
      fallbackOut: 1,
      fallbackMessageId: 'fallbackMessageIdTest',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 3,
      action: EventAction.Fallback,
      user_input: 'userInputTest',
      fallback_out: 1,
      fallback_message_id: 'fallbackMessageIdTest',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })

  test('The second fallback event is created', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Fallback,
      userInput: 'userInputTest',
      fallbackOut: 2,
      fallbackMessageId: 'fallbackMessageIdTest',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 3,
      action: EventAction.Fallback,
      user_input: 'userInputTest',
      fallback_out: 2,
      fallback_message_id: 'fallbackMessageIdTest',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })

  test('The third fallback event is created', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Fallback,
      userInput: 'userInputTest',
      fallbackOut: 1,
      fallbackMessageId: 'fallbackMessageIdTest',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 3,
      action: EventAction.Fallback,
      user_input: 'userInputTest',
      fallback_out: 1,
      fallback_message_id: 'fallbackMessageIdTest',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })
})
