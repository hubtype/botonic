import { testContext, testDirectus } from '../helpers/directus.helper'

test('Test: directus text without buttons without followup', async () => {
  const directus = testDirectus()
  const testText = await directus.button(
    'c5dcf600-0151-45b2-b48a-80450e764168',
    testContext()
  )
  console.log(testText)
})
