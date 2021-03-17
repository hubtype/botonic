import * as cms from '../../../src'
import { Content, SPANISH } from '../../../src'
import { testContentful, testContext } from '../contentful.helper'
import { expectImgUrlIs } from './image.test'

export const TEST_POST_FAQ1_ID = 'djwHOFKknJ3AmyG6YKNip'
export const TEST_POST_FAQ2_ID = '22h2Vba7v92MadcL5HeMrt'
export const TEST_NO_SPANISH_TEXT = '429vGzREpGXhiV24yvggTp'
const TEST_FBK_MSG = '1U7XKJccDSsI3mP0yX04Mj'
const TEST_FBK_OK_MSG = '63lakRZRu1AJ1DqlbZZb9O'
export const TEST_SORRY = '6ZjjdrKQbaLNc6JAhRnS8D'
const TEST_TEXT_QUEUE_BUTTON = '7Liwyx92Yna3fzHvh9AGut'
const TEST_TEXT_URL_BUTTON = '2N9HQ960BdUVlDDQjpTA6I'
const TEST_TEXT_IMAGE_FOLLOWUP = '35aCTbYevK13TAXqqCdY8t'
const TEXT_TEXT_FOLLOWUP = '6qkqu4uXc4FMSVm8grtiBR'
export const KEYWORDS_OK = 'GbIpKJu8kW6PqMGAUYkoS'
export const KEYWORDS_NOT_FOUND = '4C2ghzuNPXIl0KqLaq1Qqm'

test('TEST: contentful text with callback to MessageContentType without followup', async () => {
  const sut = testContentful()
  const text = await sut.text(TEST_SORRY, testContext()) // actually returns the fallback language (es)
  expectContentIsSorryText(text)
})

export function expectContentIsSorryText(content: Content) {
  expect(content).toBeInstanceOf(cms.Text)
  const text = content as cms.Text
  expect(text.text).toEqual(
    'Siento no haber podido ayudarle, le invitamos a contactar con uno de nuestros agentes.'
  )
  expect(text.buttons).toHaveLength(1)
  expect(text.buttons[0].text).toEqual('Contactar con agente')
  expect(text.buttons[0].callback).toEqual(
    new cms.ContentCallback(cms.ContentType.TEXT, '3lzJqY4sI3VDgMRFsgvtvT')
  )
  expect(text.common.followUp).toBeUndefined()
}

test('TEST: contentful text with callback to NonMessageContentType without followup', async () => {
  const sut = testContentful()

  // act
  const text = await sut.text(TEST_TEXT_QUEUE_BUTTON, { locale: cms.ENGLISH }) // actually returns the fallback language (es)

  // assert
  expect(text.buttons).toHaveLength(1)
  expect(text.buttons[0].text).toEqual('Queue Short Text')
  expect(text.buttons[0].callback).toEqual(
    new cms.ContentCallback(cms.ContentType.QUEUE, '62ILnVxLHOEp7aVvPMpCO8')
  )
})

test('TEST: contentful text with URL button with followup', async () => {
  const sut = testContentful()

  // act
  const ctx = testContext([{ locale: SPANISH }])
  const text = await sut.text(TEST_POST_FAQ1_ID, ctx)

  // assert
  expect(text.text).toEqual('Cómo encontrar su “pedido”\n' + '...')
  expect(text.common.shortText).toEqual(
    ctx && ctx.locale == 'es' ? 'Encontrar mi pedido' : 'Find my command'
  )
  expect(text.buttons).toHaveLength(1)
  expect(text.buttons[0].text).toEqual('Acceda a su cuenta')
  expect(text.buttons[0].callback.url).toEqual('https://shop.com/es/')
  expect(text.common.followUp).not.toBeUndefined()
})

test('TEST: contentful text with payload button', async () => {
  const sut = testContentful()

  // act
  const text = await sut.text(KEYWORDS_NOT_FOUND, testContext())

  // assert
  expect(text.buttons).toHaveLength(1)
  expect(text.buttons[0].callback.payload).toBe('humanHandOff')
})

test('TEST: contentful text without buttons with text followup', async () => {
  const sut = testContentful()

  // act
  const text = await sut.text(TEST_POST_FAQ2_ID, testContext())

  // assert
  expect(text.buttons).toHaveLength(0)
  expect((text.common.followUp as cms.Text).buttons).toHaveLength(2)
})

test('TEST: contentful text without buttons with carousel followup', async () => {
  const sut = testContentful()

  // act
  const text = await sut.text(TEST_FBK_OK_MSG, testContext())

  // assert
  expect(text.buttons).toHaveLength(0)
  expect((text.common.followUp as cms.Carousel).elements).toHaveLength(3)
})

test('TEST: contentful text without buttons with image followup with text followup', async () => {
  const sut = testContentful()

  // act
  const text = await sut.text(TEST_TEXT_IMAGE_FOLLOWUP, testContext())

  // assert
  const followUp1 = text.common.followUp as cms.Image
  expect(followUp1).toBeInstanceOf(cms.Image)
  expectImgUrlIs(followUp1.imgUrl, 'red.jpg')

  const followUp2 = followUp1.common.followUp as cms.Text
  expect(followUp2).toBeInstanceOf(cms.Text)

  const feedback = await sut.text(TEST_FBK_MSG, testContext())
  expect(followUp2).toEqual(feedback)
})

test('TEST: contentful text with text followup with text followup', async () => {
  const sut = testContentful()

  // act
  const text = await sut.text(TEXT_TEXT_FOLLOWUP, testContext())

  // assert
  const followUp1 = text.common.followUp as cms.Text
  expect(followUp1).toBeInstanceOf(cms.Text)
  expect(followUp1.common.name).toEqual('POST_FAQ2')

  const followUp2 = followUp1.common.followUp as cms.Text
  expect(followUp2).toBeInstanceOf(cms.Text)
  expect(followUp2.common.name).toEqual('FBK_MSG')
})

test('TEST: contentful text with URL button', async () => {
  const sut = testContentful()

  // act
  const text = await sut.text(TEST_TEXT_URL_BUTTON, { locale: 'en' })

  // assert
  expect(text.buttons).toHaveLength(1)
  expect(text.buttons[0].text).toEqual('Web de Hubtype')
  expect(text.buttons[0].callback).toEqual(
    cms.Callback.ofUrl('https://www.hubtype.com/en')
  )
})

test('Test: contentful text with custom field of type text', async () => {
  const sut = testContentful()
  const text = await sut.text(TEST_SORRY, testContext())
  expect(text.common.customFields).toEqual({
    customFieldText: 'This text is from a custom field',
  })
})
