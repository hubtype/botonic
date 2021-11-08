import { ContentType } from '../../../src/cms'
//import { /*ContentId,*/ ContentType } from '../../../src/cms'
import { testContext, testDirectus } from '../helpers/directus.helper'

//const MULTI_LANGUAGE_TEXT_ID = 'ee791f5c-f90a-49af-b75e-f6aac779b902'
// const MULTI_LANGUAGE_CAROUSEL_ID = '874d9221-339b-48bc-b203-8217c9f2e8be'
// const MULTI_LANGUAGE_IMAGE_ID = '178c4ab2-9414-4cd3-ae71-7ff4025b7bbe'
// const MULTI_LANGUAGE_BUTTON_ID = '84d8d76c-f4a1-4b9e-b0c0-238ebb5daa61'
// const MULTI_LANGUAGE_URL_ID = '2e3ff9bd-7a09-4684-be16-1337d68fbf9e'

// test('Test: text', async () => {
//   const directus = testDirectus()
//   const testText = await directus.text(
//     'd81c1530-f14a-4275-a826-f907846c2ab1',
//     testContext()
//   )
//   console.log(testText)
// })

// test('Test: carousel', async () => {
//   const directus = testDirectus()
//   const testCarousel = await directus.carousel(
//     MULTI_LANGUAGE_CAROUSEL_ID,
//     testContext()
//   )
//   console.log(testCarousel)
// })

// test('Test: image', async () => {
//   const directus = testDirectus()
//   const testImage = await directus.image(MULTI_LANGUAGE_IMAGE_ID, testContext())
//   console.log(testImage)
// })

// test('Test: button', async () => {
//   const directus = testDirectus()
//   const testButton = await directus.button(
//     MULTI_LANGUAGE_BUTTON_ID,
//     testContext()
//   )
//   console.log(testButton)
// })

// test('Test: url', async () => {
//   const directus = testDirectus()
//   const testUrl = await directus.url(MULTI_LANGUAGE_URL_ID, testContext())
//   console.log(testUrl)
// })

test('Test: topContents', async () => {
  const directus = testDirectus()
  const topContents = await directus.topContents(
    ContentType.IMAGE,
    testContext()
  )
  console.log('topContent:', topContents)
})

// test('Test: get  the list of locales', async () => {
//   const directus = testDirectus()
//   const locales = await directus.getLocales()
//   console.log({ locales })
// })

// test('Test: update content in locale', async () => {
//   const directus = testDirectus()
//   const CAROUSEL_ID = '82e47156-9a9a-4fd8-a20c-b4240de2489c'
//   const elementId = '189121a1-5a99-4f73-8639-637eba9a3a1f'

//   await directus.updateElementFields(testContext(), elementId, {
//     name: 'ELEMENT_UPDATED',
//     title: 'updated title',
//     subtitle: 'updated subtitle',
//     buttons: ['e795d0e5-7e4a-4a13-a5be-21416b1fbd27'],
//   })
//   await directus.updateCarouselFields(testContext(), CAROUSEL_ID, {
//     name: 'CAROUSEL_UPDATED',
//     elements: [elementId],
//   })

//   const carousel = await directus.carousel(CAROUSEL_ID, testContext())
//   console.log({ carousel })
// })

// test('Test: update content in locale', async () => {
//   const directus = testDirectus()
//   const textId = '13dfd5aa-357a-4942-bdcc-6484906816e0'

//   await directus.updateTextFields(testContext(), textId, {
//     followup: new ContentId(
//       ContentType.CAROUSEL,
//       '82e47156-9a9a-4fd8-a20c-b4240de2489c'
//     ),
//   })

//   const carousel = await directus.text(textId, testContext())
//   console.log({ carousel })
// })
