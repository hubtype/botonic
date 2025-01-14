import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create nlu keyword events', () => {
  const requestData = getRequestData()
  test('should create keyword event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Keyword,
      nluKeywordName: 'hello',
      nluKeywordIsRegex: false,
      nluKeywordMessageId: 'messageId',
      userInput: 'hello',
      flowThreadId: 'flowThreadId',
      flowId: 'flowId',
      flowNodeId: 'keywordNodeId',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.Keyword,
      nlu_keyword_name: 'hello',
      nlu_keyword_is_regex: false,
      nlu_keyword_message_id: 'messageId',
      user_input: 'hello',
      flow_thread_id: 'flowThreadId',
      flow_id: 'flowId',
      flow_node_id: 'keywordNodeId',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })
})
