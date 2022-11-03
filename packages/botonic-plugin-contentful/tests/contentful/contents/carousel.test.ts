import * as cms from '../../../src'
import { SPANISH, Video } from '../../../src'
import { testContentful, testContext } from '../contentful.helper'
import { expectImgUrlIs } from './image.test'

export const TEST_CAROUSEL_MAIN_ID = '2yR9f3stNAEqdamUr8VtfD'
export const TEST_POST_MENU_CRSL = '7ATP377r6Nb8VqNtRKAS4J'

test('TEST: contentful carousel', async () => {
  const sut = testContentful()

  // act
  const carousel = await sut.carousel(
    TEST_CAROUSEL_MAIN_ID,
    testContext([{ locale: SPANISH }])
  )

  // assert
  expect(carousel.elements).toHaveLength(2)
  expect(carousel.common.name).toEqual('INICIO')
  expect(carousel.common.keywords).toEqual(['Inicio', 'menu', 'empezar'])
  expect(carousel.common.shortText).toEqual('Menú de Inicio')
  expect(carousel.common.customFields).toEqual({
    customFieldNumber: 3.14159265389,
  })
  expect(carousel.common.followUp).toBeInstanceOf(Video)
  expect(carousel.common.followUp!.name).toBe('VIDEO_TEST')
  assertElementDudasPrevias(carousel.elements[0])
})

test('TEST: contentful element', async () => {
  const sut = testContentful()

  // act
  const element = await sut.element(
    '714AB6c5NZoHLku5NoYVPE',
    testContext([{ locale: SPANISH }])
  )

  //assert
  assertElementDudasPrevias(element)
})

function assertElementDudasPrevias(element: cms.Element) {
  expect(element.title).toBe('Dudas previas a la compra')
  expect(element.subtitle).toBe(
    'Le ayudaré con sus compras en la tienda online.'
  )
  expectImgUrlIs(element.imgUrl, 'blue.jpg')
  expect(element.buttons).toHaveLength(1)
  expect(element.buttons[0].callback.payload).toBe(
    'text${"id":"79aRfznNCyN2VGdGDQZBf3","origin":{"id":"1Vok09scT4qh1tfCse619q","name":"PRE_MENU_CRSL","text":"Ver opciones"}}'
  )
  expect(element.buttons[0].text).toBe('Ver opciones')
}
