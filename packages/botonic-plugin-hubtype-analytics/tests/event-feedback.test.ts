import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create feedback event', () => {
  // test('A message feedback event is created', () => {
  //   const requestData = getRequestData()
  //   const htEvent = createHtEvent(requestData, {
  //     action: EventAction.FeedbackMessage,
  //     data: {
  //       possibleOptions: ['thumbs_up', 'thumbs_down'],
  //       possibleValues: [1, 0],
  //       option: 'thumbs_up',
  //       value: 1,
  //     },
  //   })

  //   expect(JSON.stringify(htEvent)).toBe(
  //     JSON.stringify({
  //       chat_id: 'chatIdTest',
  //       chat_language: 'es',
  //       chat_country: 'ES',
  //       format_version: 2,
  //       data: {
  //         action: EventAction.FeedbackMessage,
  //         possible_options: ['thumbs_up', 'thumbs_down'],
  //         possible_values: [1, 0],
  //         option: 'thumbs_up',
  //         value: 1,
  //       },
  //       type: EventType.feedback,
  //     })
  //   )
  // })

  test('A conversation feedback event is created', () => {
    const requestData = getRequestData()
    const htEvent = createHtEvent(requestData, {
      action: EventAction.FeedbackMessage,
      data: {
        possibleOptions: ['*', '**', '***', '****', '*****'],
        possibleValues: [1, 2, 3, 4, 5],
        option: '**',
        value: 2,
      },
    })

    expect(JSON.stringify(htEvent)).toBe(
      JSON.stringify({
        chat_id: 'chatIdTest',
        chat_language: 'es',
        chat_country: 'ES',
        format_version: 2,
        data: {
          action: EventAction.FeedbackMessage,
          possible_options: ['*', '**', '***', '****', '*****'],
          possible_values: [1, 2, 3, 4, 5],
          option: '**',
          value: 2,
        },
        type: EventType.Feedback,
      })
    )
  })
})
