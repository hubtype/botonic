import { testContext, testDirectus } from '../helpers/directus.helper'

export const CAROUSEL_TEST = '3c2bfdb6-8e2f-43f8-9173-32956c11c48d'

test('Test: directus carousel', async () => {
  const directus = testDirectus()
  const testCarousel = await directus.carousel(CAROUSEL_TEST, testContext())
  expect(testCarousel.common.shortText).toEqual('Show carousel')
  expect(testCarousel.elements.length).toEqual(2)
  expect(testCarousel.elements[0].subtitle).toEqual('Subtitle of element_1')
  expect(testCarousel.elements[0].buttons.length).toEqual(1)
  expect(testCarousel.elements[1].buttons.length).toEqual(2)
})
