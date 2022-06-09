import { BotonicOutputParserTester } from '../helpers/parsing'

const tester = new BotonicOutputParserTester()
describe('Parsing Custom responses', () => {
  it('TEST: Custom', () => {
    const botResponse = `
    <message typing="0" delay="0" markdown="1" type="text">
        Custom Message
    </message>
    <message json="{&quot;customTypeName&quot;:&quot;calendar&quot;}" typing="0" delay="0" type="custom">
    <div class="react-calendar">COMPONENT HTML DATA</div>
        <p></p>
        <reply payload="payload cus1">Payload Custom 1</reply>
        <reply payload="payload cus2">Payload Custom 2</reply>
    </message>
`
    const expected = [
      {
        eventType: 'message',
        type: 'text',
        delay: 0,
        typing: 0,
        buttons: [],
        replies: [],
        text: 'Custom Message',
        markdown: true,
      },
      {
        eventType: 'message',
        type: 'custom',
        delay: 0,
        typing: 0,
        replies: [
          {
            payload: 'payload cus1',
            title: 'Payload Custom 1',
          },
          {
            payload: 'payload cus2',
            title: 'Payload Custom 2',
          },
        ],
        json: {
          customTypeName: 'calendar',
        },
      },
    ]
    tester.parseResponseAndAssert(botResponse, expected)
  })
})
