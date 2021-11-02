import { testContext, testDirectus } from '../helpers/directus.helper'

const MULTI_LANGUAGE_TEXT_ID = 'ee791f5c-f90a-49af-b75e-f6aac779b902'
const MULTI_LANGUAGE_CAROUSEL_ID = '82e47156-9a9a-4fd8-a20c-b4240de2489c'
const MULTI_LANGUAGE_IMAGE_ID = '178c4ab2-9414-4cd3-ae71-7ff4025b7bbe'
const MULTI_LANGUAGE_BUTTON_ID = 'e795d0e5-7e4a-4a13-a5be-21416b1fbd27'
const MULTI_LANGUAGE_URL_ID = '2e3ff9bd-7a09-4684-be16-1337d68fbf9e'

test('Test: text', async () => {
  const directus = testDirectus()
  const testText = await directus.text(MULTI_LANGUAGE_TEXT_ID, testContext())
  console.log(testText)
})

test('Test: carousel', async () => {
  const directus = testDirectus()
  const testCarousel = await directus.carousel(
    MULTI_LANGUAGE_CAROUSEL_ID,
    testContext()
  )
  console.log(testCarousel)
})

test('Test: image', async () => {
  const directus = testDirectus()
  const testImage = await directus.image(MULTI_LANGUAGE_IMAGE_ID, testContext())
  console.log(testImage)
})

test('Test: button', async () => {
  const directus = testDirectus()
  const testButton = await directus.button(
    MULTI_LANGUAGE_BUTTON_ID,
    testContext()
  )
  console.log(testButton)
})

test('Test: url', async () => {
  const directus = testDirectus()
  const testUrl = await directus.url(MULTI_LANGUAGE_URL_ID, testContext())
  console.log(testUrl)
})
