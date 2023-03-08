import { BotonicOutputParserTester } from '../helpers/parsing'

const tester = new BotonicOutputParserTester()
describe('Parsing Contact responses', () => {
  it.only('TEST: Contact', () => {
    const botResponse = `
    <message typing="0" delay="0" markdown="1" type="contact" phone_number="34654321000" first_name="Test" last_name="Tester" vcard=null></message>
`
    const expected = [
      {
        ack: undefined,
        from: undefined,
        typing: 0,
        delay: 0,
        eventType: 'message',
        type: 'contact',
        phone_number: '34654321000',
        first_name: 'Test',
        last_name: 'Tester',
        vcard: undefined,
      },
    ]
    tester.parseResponseAndAssert(botResponse, expected)
  })
})
