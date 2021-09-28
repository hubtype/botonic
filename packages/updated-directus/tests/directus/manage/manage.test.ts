import { testContext, testDirectus } from '../helpers/directus'
import {
  Text,
  Image,
  MessageContentType,
  SubContentType,
} from '../../../src/cms'

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

test('Test: create content with given id', async () => {
  const directus = testDirectus()
  await directus.createContent(
    testContext(),
    MessageContentType.TEXT,
    randomUUID
  )
  const content = await directus.text(randomUUID, testContext())
  expect(content.common.id).toBe(randomUUID)

  await directus.deleteContent(
    testContext(),
    MessageContentType.TEXT,
    randomUUID
  )
})

test('Test: update content of type text', async () => {
  const directus = testDirectus()
  const newContentId = '8ea1c538-2078-11ec-9621-0242ac130002'
  const newButtonId = '97cbd90a-2078-11ec-9621-0242ac130002'
  const newTargetId = '9cfb4c80-2078-11ec-9621-0242ac130002'
  await directus.createContent(
    testContext(),
    MessageContentType.TEXT,
    newContentId
  )
  await directus.updateTextFields(testContext(), newContentId, {
    name: 'name_changed_test',
    text: 'new text changed!',
    buttons: [
      {
        id: newButtonId,
        name: 'new_button_created_when_update',
        text: 'new button texttttt',
        target: {
          id: newTargetId,
          name: 'new_target_image_created_when_update',
          targetType: MessageContentType.IMAGE,
        },
        buttonType: SubContentType.BUTTON,
      },
    ],
  })

  const contentUpdated = await directus.text(newContentId, testContext())
  expect(contentUpdated.common.name).toBe('name_changed_test')
  expect(contentUpdated.buttons![0].text).toBe('new button texttttt')

  await directus.deleteContent(
    testContext(),
    MessageContentType.TEXT,
    newContentId
  )
  await directus.deleteContent(
    testContext(),
    SubContentType.BUTTON,
    newButtonId
  )
  await directus.deleteContent(
    testContext(),
    MessageContentType.IMAGE,
    newTargetId
  )
})
