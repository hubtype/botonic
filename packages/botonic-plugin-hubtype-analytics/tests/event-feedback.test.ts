import { createHtEvent, EventName, FeedbackAction } from '../src'
import { getRequestData } from './helpers'

describe('Create feedback event', () => {
  test('A message feedback event is created', () => {
    const requestData = getRequestData()
    const htEvent = createHtEvent(requestData, {
      type: EventName.feedback,
      data: {
        action: FeedbackAction.message,
        possibleOptions: ['thumbs_up', 'thumbs_down'],
        possibleValues: [1, 0],
        option: 'thumbs_up',
        value: 1,
        // messageGeneratedBy: {
        //   chunks_ids:
        //   source_id:
        //   content_id:
        // }
      },
    })

    expect(JSON.stringify(htEvent)).toBe(
      JSON.stringify({
        chat_id: 'chatIdTest',
        type: EventName.feedback,
        channel: 'webchat',
        created_at: htEvent.created_at,
        chat_language: 'es',
        chat_country: 'ES',
        format_version: 2,
        data: {
          action: FeedbackAction.message,
          // message_generated_by: undefined,
          // feedback_target_id: undefined,
          // feedback_group_id: undefined,
          possible_options: ['thumbs_up', 'thumbs_down'],
          possible_values: [1, 0],
          option: 'thumbs_up',
          value: 1,
        },
      })
    )
  })

  // test('A conversation feedback event is created', () => {
  //   const requestData = getRequestData()
  //   const htEvent = createHtEvent(requestData, {
  //     type: EventName.feedback,
  //     data: {
  //       action: FeedbackAction.conversation,
  //       possibleOptions: ['thumbs_up', 'thumbs_down'],
  //       possibleValues: [1, 0],
  //       option: 'thumbs_up',
  //       value: 1,
  //     },
  //   })

  //   expect(JSON.stringify(htEvent)).toBe(
  //     JSON.stringify({
  //       chat_id: 'chatIdTest',
  //       type: EventName.feedback,
  //       channel: 'webchat',
  //       created_at: htEvent.created_at,
  //       chat_language: 'es',
  //       chat_country: 'ES',
  //       format_version: 2,
  //       data: {
  //         action: FeedbackAction.conversation,
  //         // message_generated_by: undefined,
  //         // feedback_target_id: undefined,
  //         // feedback_group_id: undefined,
  //         possible_options: ['thumbs_up', 'thumbs_down'],
  //         possible_values: [1, 0],
  //         option: 'thumbs_up',
  //         value: 1,
  //       },
  //     })
  //   )
  // })

  // test('A webview feedback event is created', () => {
  //   const requestData = getRequestData()
  //   const htEvent = createHtEvent(requestData, {
  //     type: EventName.feedback,
  //     data: {
  //       action: FeedbackAction.webview,
  //       possibleOptions: ['thumbs_up', 'thumbs_down'],
  //       possibleValues: [1, 0],
  //       option: 'thumbs_up',
  //       value: 1,
  //     },
  //   })

  //   expect(JSON.stringify(htEvent)).toBe(
  //     JSON.stringify({
  //       chat_id: 'chatIdTest',
  //       type: EventName.feedback,
  //       channel: 'webchat',
  //       created_at: htEvent.created_at,
  //       chat_language: 'es',
  //       chat_country: 'ES',
  //       format_version: 2,
  //       data: {
  //         action: FeedbackAction.webview,
  //         // message_generated_by: undefined,
  //         // feedback_target_id: undefined,
  //         // feedback_group_id: undefined,
  //         possible_options: ['thumbs_up', 'thumbs_down'],
  //         possible_values: [1, 0],
  //         option: 'thumbs_up',
  //         value: 1,
  //       },
  //     })
  //   )
  // })
})
