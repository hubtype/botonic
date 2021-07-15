import { BotonicOutputParserTester } from '../helpers'

// TODO: Test with Markdown, test with Markdown + new lines

const tester = new BotonicOutputParserTester()
describe('Parsing Text responses', () => {
  it('TEST: Text', () => {
    const botResponse = `
    <message typing="1" delay="0" markdown="1" type="text">
      Hello World
    </message>
    <message typing="0" delay="1" markdown="0" type="text">
      Bye bye!
    </message>
    `
    const expected = [
      {
        eventType: 'message',
        type: 'text',
        delay: 0,
        typing: 1,
        buttons: [],
        replies: [],
        text: 'Hello World',
        markdown: true,
      },
      {
        eventType: 'message',
        type: 'text',
        delay: 1,
        typing: 0,
        buttons: [],
        replies: [],
        text: 'Bye bye!',
        markdown: false,
      },
    ]
    tester.parseResponseAndAssert(botResponse, expected)
  })

  it('TEST: Text with Buttons', () => {
    const botResponse = `
    <message typing="0" delay="0" markdown="1" type="text">
      Some numbers 12
      <button payload="payload1">Button1</button>
      <button payload="__PATH_PAYLOAD__path1">Path1</button>
      <button url="https://www.google.com" target="_blank">Url with target</button>
    </message>
    `
    const expected = [
      {
        eventType: 'message',
        type: 'text',
        delay: 0,
        typing: 0,
        buttons: [
          { title: 'Button1', payload: 'payload1' },
          { title: 'Path1', payload: '__PATH_PAYLOAD__path1' },
          {
            title: 'Url with target',
            url: 'https://www.google.com',
            target: '_blank',
          },
        ],
        replies: [],
        text: 'Some numbers 12',
        markdown: true,
      },
    ]
    tester.parseResponseAndAssert(botResponse, expected)
  })

  it('TEST: Text with Replies', () => {
    const botResponse = `
    <message typing="0" delay="0" markdown="1" type="text">
      Some replies
      <reply payload="payload1">ReplyPayload1</reply>
      <reply payload="__PATH_PAYLOAD__path1">ReplyPath1</reply>
    </message>
    `
    const expected = [
      {
        eventType: 'message',
        type: 'text',
        delay: 0,
        typing: 0,
        buttons: [],
        replies: [
          { title: 'ReplyPayload1', payload: 'payload1' },
          { title: 'ReplyPath1', payload: '__PATH_PAYLOAD__path1' },
        ],
        text: 'Some replies',
        markdown: true,
      },
    ]
    tester.parseResponseAndAssert(botResponse, expected)
  })

  it('TEST: Text with Buttons + Replies', () => {
    const botResponse = `
    <message typing="0" delay="0" markdown="1" type="text">
      Text with Buttons and Replies
      <button payload="payload1">Button1</button>
      <button url="https://www.google.com" target="_blank">Url with target</button>
      <reply payload="payload1">ReplyPayload1</reply>
      <reply payload="__PATH_PAYLOAD__path1">ReplyPath1</reply>
    </message>
    `
    const expected = [
      {
        eventType: 'message',
        type: 'text',
        delay: 0,
        typing: 0,
        buttons: [
          { title: 'Button1', payload: 'payload1' },
          {
            title: 'Url with target',
            url: 'https://www.google.com',
            target: '_blank',
          },
        ],
        replies: [
          { title: 'ReplyPayload1', payload: 'payload1' },
          { title: 'ReplyPath1', payload: '__PATH_PAYLOAD__path1' },
        ],
        text: 'Text with Buttons and Replies',
        markdown: true,
      },
    ]
    tester.parseResponseAndAssert(botResponse, expected)
  })

  it('TEST: Text with formatted markdown', () => {})
})
