import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create nlu keyword events', () => {
  const requestData = getRequestData()
  test('should create keyword event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Keyword,
      data: {
        nluKeywordId: 'keywordId',
        nluKeywordName: 'hello',
        nluKeywordIsRegex: false,
        nluKeywordMessageId: 'messageId',
      },
    })

    expect(JSON.stringify(htEvent)).toBe(
      JSON.stringify({
        chat_id: 'chatIdTest',
        chat_language: 'es',
        chat_country: 'ES',
        format_version: 2,
        data: {
          action: EventAction.Keyword,
          nlu_keyword_id: 'keywordId',
          nlu_keyword_name: 'hello',
          nlu_keyword_is_regex: false,
          nlu_keyword_message_id: 'messageId',
        },
        type: EventType.Botevent,
      })
    )
  })
})
