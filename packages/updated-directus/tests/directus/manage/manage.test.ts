import { testContext, testDirectus } from '../helpers/directus'
import {
  Text,
  Image,
  MessageContentType,
  SubContentType,
  ContentType,
} from '../../../src/cms'
import {
  createContents,
  deleteContents,
  generateRandomUUID,
} from './helpers/utils'

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

test('Test: update content of type text and button', async () => {
  const directus = testDirectus()

  const newContentId = generateRandomUUID()
  const newButtonId = generateRandomUUID()
  const newTargetId = generateRandomUUID()
  const newFollowupId = generateRandomUUID()

  const ContentTypePerId: Record<string, ContentType> = {
    [newContentId]: MessageContentType.TEXT,
    [newButtonId]: SubContentType.BUTTON,
    [newFollowupId]: MessageContentType.TEXT,
    [newTargetId]: MessageContentType.IMAGE,
  }

  await createContents(ContentTypePerId)

  await directus.updateTextFields(testContext(), newContentId, {
    name: 'bla_bla_bla',
    text: 'new text changed!',
    buttons: [newButtonId],
    followup: {
      id: newFollowupId,
      type: MessageContentType.TEXT,
    },
  })

  await directus.updateButtonFields(testContext(), newButtonId, {
    name: 'button_updated_from_test',
    text: 'helllou',
    target: {
      id: newTargetId,
      type: MessageContentType.IMAGE,
    },
  })

  await directus.updateTextFields(testContext(), newFollowupId, {
    name: 'follow_up_updated',
    text: 'helllou',
  })

  const contentUpdated = await directus.text(newContentId, testContext())

  expect(contentUpdated.common.name).toBe('bla_bla_bla')
  expect(contentUpdated.buttons![0].text).toBe('helllou')
  expect((contentUpdated.common.followup as Text).name).toBe(
    'follow_up_updated'
  )

  await deleteContents(ContentTypePerId)
})
