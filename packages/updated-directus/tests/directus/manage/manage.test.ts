import { testContext, testDirectus } from '../helpers/directus'
import { Text, Image, MessageContentType } from '../../../src/cms'

const randomUUID = 'd8b5a518-1fbf-11ec-9621-0242ac130002'
const myMock = jest.fn()

test('Test: get all contents of type text', async () => {
  const directus = testDirectus()
  const textEntries = await directus.topContents(
    MessageContentType.TEXT,
    testContext()
  )
  textEntries.forEach(textEntry => {
    expect(textEntry).toBeInstanceOf(Text)
  })
})

test('Test: get all contents of type image', async () => {
  const directus = testDirectus()
  const imageEntries = await directus.topContents(
    MessageContentType.IMAGE,
    testContext()
  )
  imageEntries.forEach(imageEntry => {
    expect(imageEntry).toBeInstanceOf(Image)
  })
})

test('Test: create content with given id', async () => {
  const directus = testDirectus()
  await directus.createContent(
    testContext(),
    MessageContentType.TEXT,
    randomUUID
  )
  const content = await directus.text(randomUUID, testContext())
  expect(content.common.id).toBe(randomUUID)
})

test('Test: delete content from content id', async () => {
  const directus = testDirectus()
  await directus.deleteContent(
    testContext(),
    MessageContentType.TEXT,
    randomUUID
  )
  try {
    await directus.text(randomUUID, testContext())
  } catch (e) {
    myMock()
  }
  expect(myMock).toBeCalledTimes(1)
})
