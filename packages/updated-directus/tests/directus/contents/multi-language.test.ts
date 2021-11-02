import { testContext, testDirectus } from '../helpers/directus.helper'

const MULTI_LANGUAGE_TEXT_ID = 'ee791f5c-f90a-49af-b75e-f6aac779b902'
const MULTI_LANGUAGE_CAROUSEL_ID = '82e47156-9a9a-4fd8-a20c-b4240de2489c'
const MULTI_LANGUAGE_IMAGE_ID = '178c4ab2-9414-4cd3-ae71-7ff4025b7bbe'

test('Test: text', async () => {
  const directus = testDirectus()
  const testText = await directus.text(MULTI_LANGUAGE_TEXT_ID, testContext())
  console.log(testText.buttons[0])
})

test('Test: carousel', async () => {
  const directus = testDirectus()
  const testCarousel = await directus.carousel(
    MULTI_LANGUAGE_CAROUSEL_ID,
    testContext()
  )
  console.log(testCarousel.elements)
})

test('Test: image', async () => {
  const directus = testDirectus()
  const testImage = await directus.image(MULTI_LANGUAGE_IMAGE_ID, testContext())
  console.log(testImage)
})

// test('Test: button', async () => {
//   const directus = testDirectus()
//   const testCarousel = await directus.carousel(
//     MULTI_LANGUAGE_CAROUSEL_ID,
//     testContext()
//   )
//   console.log(testCarousel.elements[0].buttons[0])
// })

// test('Test: url', async () => {
//   const directus = testDirectus()
//   const testCarousel = await directus.carousel(
//     MULTI_LANGUAGE_CAROUSEL_ID,
//     testContext()
//   )
//   console.log(testCarousel.elements[0].buttons[0])
// })
