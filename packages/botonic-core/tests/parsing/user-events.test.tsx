import { BotonicOutputParserTester } from '../helpers/parsing'

const tester = new BotonicOutputParserTester()

describe('Parsing Text responses', () => {
  it('TEST: Text sent by user', () => {
    const userInput = {
      type: 'text',
      text: 't',
      id: 'b584bc1c-0524-44f6-a6fe-0845f87e236d',
    }

    const expected = {
      eventType: 'message',
      type: 'text',
      buttons: [],
      replies: [],
      text: 't',
      markdown: true,
    }
    tester.parseUserInputAndAssert(userInput, expected)
  })

  it('TEST: Button clicked by user (no postback)', () => {
    const userInput = {
      type: 'text',
      text: 'Button1',
      payload: 'payload1',
      id: 'af0a25b9-e601-4460-81da-86a2701cbc11',
    }

    const expected = {
      eventType: 'message',
      type: 'text',
      buttons: [],
      replies: [],
      text: 'Button1',
      markdown: true,
    }
    tester.parseUserInputAndAssert(userInput, expected)
  })

  it('TEST: Postback sent by user', () => {
    const userInput = {
      type: 'postback',
      payload: 'hi',
      id: '23522aed-bfec-423d-b311-79825661666b',
    }

    const expected = { eventType: 'message', type: 'postback', payload: 'hi' }
    tester.parseUserInputAndAssert(userInput, expected)
  })

  it('TEST: Media attachment by user', () => {
    const userInput = {
      type: 'image',
      src: 'data:image/png;base64,iVBORw0KG',
      id: 'bf5090f0-0e79-4a17-bb0e-46797cd5b363',
    }

    const expected = {
      eventType: 'message',
      type: 'image',
      buttons: [],
      src: 'data:image/png;base64,iVBORw0KG',
    }

    tester.parseUserInputAndAssert(userInput, expected)
  })

  it('TEST: Missed with media type sent by user', () => {
    const userInput = {
      type: 'missed',
      reason: 'disallowed_attachments',
      media_type: 'document',
      id: '23522aed-bfec-423d-b311-79825661666b',
    }

    const expected = { eventType: 'message', type: 'missed', reason: 'disallowed_attachments', media_type: 'document' }
    tester.parseUserInputAndAssert(userInput, expected)
  })
})
