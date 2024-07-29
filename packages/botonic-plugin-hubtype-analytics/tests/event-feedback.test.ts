import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create feedback event', () => {
  test('A conversation feedback event is created', () => {
    const requestData = getRequestData()
    const htEvent = createHtEvent(requestData, {
      action: EventAction.FeedbackCase,
      feedbackTargetId: 'caseId',
      feedbackGroupId: 'groupIdTest',
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
      action: EventAction.FeedbackCase,
      feedback_target_id: 'caseId',
      feedback_group_id: 'groupIdTest',
      possible_options: ['*', '**', '***', '****', '*****'],
      possible_values: [1, 2, 3, 4, 5],
      option: '**',
      value: 2,
      type: EventType.WebEvent,
      bot_interaction_id: 'testInteractionId',
    })
  })

  test('A conversation feedback event with commnet is created', () => {
    const requestData = getRequestData()
    const htEvent = createHtEvent(requestData, {
      action: EventAction.FeedbackConversation,
      feedbackTargetId: 'chatIdTest',
      feedbackGroupId: 'groupIdTest',
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
      feedback_target_id: 'chatIdTest',
      feedback_group_id: 'groupIdTest',
      possible_options: ['*', '**', '***', '****', '*****'],
      possible_values: [1, 2, 3, 4, 5],
      option: '**',
      value: 2,
      comment: 'This is a comment',
      type: EventType.WebEvent,
      bot_interaction_id: 'testInteractionId',
    })
  })
})
