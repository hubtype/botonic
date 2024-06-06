import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create feedback event', () => {
  test('A conversation feedback event is created', () => {
    const requestData = getRequestData()
    const htEvent = createHtEvent(requestData, {
      action: EventAction.FeedbackMessage,
      possibleOptions: ['*', '**', '***', '****', '*****'],
      possibleValues: [1, 2, 3, 4, 5],
      option: '**',
      value: 2,
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.FeedbackMessage,
      possible_options: ['*', '**', '***', '****', '*****'],
      possible_values: [1, 2, 3, 4, 5],
      option: '**',
      value: 2,
      type: EventType.Feedback,
    })
  })

  test('A conversation feedback event with commnet is created', () => {
    const requestData = getRequestData()
    const htEvent = createHtEvent(requestData, {
      action: EventAction.FeedbackConversation,
      possibleOptions: ['*', '**', '***', '****', '*****'],
      possibleValues: [1, 2, 3, 4, 5],
      option: '**',
      value: 2,
      comment: 'This is a comment',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.FeedbackConversation,
      possible_options: ['*', '**', '***', '****', '*****'],
      possible_values: [1, 2, 3, 4, 5],
      option: '**',
      value: 2,
      comment: 'This is a comment',
      type: EventType.Feedback,
    })
  })
})
