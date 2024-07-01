import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create feedback knowledgebase event', () => {
  test('A message generated for a knowledge base recive feedback', () => {
    const requestData = getRequestData()
    const htEvent = createHtEvent(requestData, {
      action: EventAction.FeedbackKnowledgebase,
      messageGeneratedById: 'messageIdTest',
      knowledgebaseInferenceId: 'knowledgebaseInferenceIdTest',
      possibleOptions: ['thumbs_down', 'thumbs_up'],
      possibleValues: [0, 1],
      option: 'thumbs_down',
      value: 0,
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.FeedbackKnowledgebase,
      message_generated_by_id: 'messageIdTest',
      knowledgebase_inference_id: 'knowledgebaseInferenceIdTest',
      possible_options: ['thumbs_down', 'thumbs_up'],
      possible_values: [0, 1],
      option: 'thumbs_down',
      value: 0,
      type: EventType.WebEvent,
    })
  })
})
