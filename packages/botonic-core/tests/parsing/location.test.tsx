import { BotonicOutputParserTester } from '../helpers/parsing'

// TODO: Location Messages coming without typing nor delay

const tester = new BotonicOutputParserTester()
describe('Parsing Location responses', () => {
  it('TEST: Location', () => {
    const botResponse = `
    <message typing="0" delay="0" text="Open Location" lat="41.3894058" long="2.1568464" type="location">
      <lat>41.3894058</lat>
      <long>2.1568464</long>
    </message>
    `
    const expected = [
      {
        eventType: 'message',
        type: 'location',
        delay: 0,
        typing: 0,
        lat: 41.3894058,
        long: 2.1568464,
      },
    ]
    tester.parseResponseAndAssert(botResponse, expected)
  })
})
