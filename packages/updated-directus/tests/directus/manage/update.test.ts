import { ContentId, ContentType, Text } from '../../../src/cms'
import { testContext, testDirectus } from '../helpers/directus.helper'
import {
  createContents,
  deleteContents,
  generateRandomUUID,
} from './helpers/utils.helper'

test('Test: update content of type text, button, image and carousel', async () => {
  const directus = testDirectus()

  const newContentId = generateRandomUUID()
  const newButtonId = generateRandomUUID()
  const newTargetId = generateRandomUUID()
  const newFollowupId = generateRandomUUID()
  const newCarouselId = generateRandomUUID()
  const newElementId = generateRandomUUID()
  const imageId = 'ec504ae9-5575-4cf9-ad59-540c06bc8ccf'

  const ContentTypePerId: Record<string, ContentType> = {
    [newContentId]: ContentType.TEXT,
    [newButtonId]: ContentType.BUTTON,
    [newFollowupId]: ContentType.TEXT,
    [newTargetId]: ContentType.IMAGE,
    [newCarouselId]: ContentType.CAROUSEL,
    [newElementId]: ContentType.ELEMENT,
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

  await directus.updateElementFields(testContext(), newElementId, {
    name: 'ELEMENT_UPDATED',
    title: 'updated title',
    subtitle: 'updated subtitle',
    buttons: [newButtonId],
    image: imageId,
  })

  await directus.updateCarouselFields(testContext(), newCarouselId, {
    name: 'CAROUSEL_UPDATED',
    elements: [newElementId],
  })

  const updatedText = await directus.text(newContentId, testContext())

  expect(updatedText.common.name).toBe('bla_bla_bla')
  expect(updatedText.buttons![0].text).toBe('helllou')
  expect((updatedText.common.followUp as Text).name).toBe('follow_up_updated')
  expect(updatedText.buttons![0].callback.payload).toBe(`image$${newTargetId}`)

  const updatedCarousel = await directus.carousel(newCarouselId, testContext())

  expect(updatedCarousel.common.name).toBe('CAROUSEL_UPDATED')
  expect(updatedCarousel.elements![0].title).toBe('updated title')
  expect(updatedCarousel.elements![0].imgUrl).toBe(
    `http://test-cms-directus-alb-1959632461.eu-west-1.elb.amazonaws.com:8055/assets/${imageId}`
  )
  await deleteContents(ContentTypePerId)
})
