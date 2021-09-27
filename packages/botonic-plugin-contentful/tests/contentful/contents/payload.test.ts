import { CommonFields, Payload } from '../../../src/cms'
import { testContentful } from '../contentful.helper'

const TEST_PAYLOAD_RATING_5 = '5aXRE9Nm6bmuXW0C3xPkE7'

test('TEST: contentful payload', async () => {
  const payload = await testContentful().payload(TEST_PAYLOAD_RATING_5, {
    locale: 'en',
  })
  expect(payload).toEqual(
    new Payload(new CommonFields(TEST_PAYLOAD_RATING_5, ''), 'RATING_5')
  )
})
