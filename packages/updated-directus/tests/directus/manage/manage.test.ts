import { testContext, testDirectus } from '../helpers/directus'
import { Text, Image, MessageContentType } from '../../../src/cms'

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


