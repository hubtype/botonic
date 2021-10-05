import { testDirectus, testContext } from '../helpers/directus.helper'

export const URL_TEST = '54a99385-1067-4511-b101-05633f9899f7'

test('Test: directus url', async () => {
  const directus = testDirectus()
  const testUrl = await directus.url(URL_TEST, testContext())
  expect(testUrl.url).toEqual('www.google.com')
})
