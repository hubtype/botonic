import { testContext, testDirectus } from '../helpers/directus.helper'
import { Text, ContentType, ContentId } from '../../../src/cms'
import {
  createContents,
  deleteContents,
  generateRandomUUID,
} from './helpers/utils.helper'

test('Test: update content of type text and button', async () => {
  const directus = testDirectus()

  const newContentId = generateRandomUUID()
  const newButtonId = generateRandomUUID()
  const newTargetId = generateRandomUUID()
  const newFollowupId = generateRandomUUID()

  const ContentTypePerId: Record<string, ContentType> = {
    [newContentId]: ContentType.TEXT,
    [newButtonId]: ContentType.BUTTON,
    [newFollowupId]: ContentType.TEXT,
    [newTargetId]: ContentType.IMAGE,
  }

  await createContents(ContentTypePerId)

  await directus.updateTextFields(testContext(), newContentId, {
    name: 'bla_bla_bla',
    text: 'new text changed!',
    buttons: [newButtonId],
    followup: new ContentId(ContentType.TEXT, newFollowupId),
  })

  await directus.updateButtonFields(testContext(), newButtonId, {
    name: 'button_updated_from_test',
    text: 'helllou',
    target: new ContentId(ContentType.IMAGE, newTargetId),
  })

  await directus.updateTextFields(testContext(), newFollowupId, {
    name: 'follow_up_updated',
    text: 'helllou',
  })

  await directus.updateImageFields(testContext(), newTargetId, {
    name: 'image_updated',
  })

  const contentUpdated = await directus.text(newContentId, testContext())

  expect(contentUpdated.common.name).toBe('bla_bla_bla')
  expect(contentUpdated.buttons![0].text).toBe('helllou')
  expect((contentUpdated.common.followUp as Text).name).toBe(
    'follow_up_updated'
  )
  expect(contentUpdated.buttons![0].callback.payload).toBe(
    `image$${newTargetId}`
  )

  await deleteContents(ContentTypePerId)
})
