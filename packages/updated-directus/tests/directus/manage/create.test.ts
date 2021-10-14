import { ContentType } from '../../../src/cms'
import { testContext, testDirectus } from '../helpers/directus.helper'

const randomUUID = 'd8b5a518-1fbf-11ec-9621-0242ac130002'

test('Test: create content with given id', async () => {
  const directus = testDirectus()
  await directus.createContent(testContext(), ContentType.TEXT, randomUUID)
  const content = await directus.text(randomUUID, testContext())
  expect(content.common.id).toBe(randomUUID)

  await directus.deleteContent(testContext(), ContentType.TEXT, randomUUID)
})
