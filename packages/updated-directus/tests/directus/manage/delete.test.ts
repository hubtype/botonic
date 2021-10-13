import { testContext, testDirectus } from '../helpers/directus.helper'
import { ContentType } from '../../../src/cms'

const randomUUID = 'd8b5a518-1fbf-11ec-9621-0242ac130002'
const myMock = jest.fn()

test('Test: delete content from content id', async () => {
  const directus = testDirectus()
  await directus.deleteContent(testContext(), ContentType.TEXT, randomUUID)
  try {
    await directus.text(randomUUID, testContext())
  } catch (e) {
    myMock()
  }
  expect(myMock).toBeCalledTimes(1)
})
