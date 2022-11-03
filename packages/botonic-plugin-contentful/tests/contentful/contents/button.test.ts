import { ContentCallback, ContentType } from '../../../src/cms'
import { ENGLISH } from '../../../src/nlp'
import { testContentful, testContext } from '../contentful.helper'
import { TEST_SORRY } from './text.test'

export const RATING_1STAR_ID = '6JYiydi8JhveDAjDSQ2fp4'

export const BUTTON_WITH_CUSTOM_FIELD_ID = '3nJn7mdqnIO05ZwejEY4mU'

export const TEXT_WITH_CONTENT_AS_BUTTON_WITH_CUSTOM_FIELD_ID =
  '7lhNWAMgJFNoKA3b0YV5T0'

test('TEST: contentful standalone button', async () => {
  const sut = testContentful()

  const button = await sut.button('40buQOqp9jbwoxmMZhFO16', { locale: ENGLISH })
  expect(button.text).toEqual('Return an article')
  expect(button.name).toEqual('POST_FAQ3')

  expect(button.callback).toEqual(
    new ContentCallback(ContentType.TEXT, 'C39lEROUgJl9hHSXKOEXS', {
      id: '40buQOqp9jbwoxmMZhFO16',
      name: 'POST_FAQ3',
      text: 'Return an article',
    })
  )
  const payload =
    'text${"id":"C39lEROUgJl9hHSXKOEXS","origin":{"id":"40buQOqp9jbwoxmMZhFO16","name":"POST_FAQ3","text":"Return an article"}}'

  expect(button.callback.payload).toEqual(payload)

  expect(button.toString()).toEqual(
    `'40buQOqp9jbwoxmMZhFO16/POST_FAQ3' to content 'payload:${payload}'`
  )
})

test('TEST: button from direct reference to target', async () => {
  const sut = testContentful()
  const text = await sut.text(TEST_SORRY, testContext())
  const payload =
    'text${"id":"3lzJqY4sI3VDgMRFsgvtvT","origin":{"id":"3lzJqY4sI3VDgMRFsgvtvT","name":"SEND_EMAIL","text":"Contactar con agente"}}'

  expect(text.buttons[0].toString()).toEqual(`to 'payload:${payload}'`)
})

test('TEST: button with custom field', async () => {
  const sut = testContentful()
  const button = await sut.button(BUTTON_WITH_CUSTOM_FIELD_ID, testContext())
  expect(button.customFields.customTextField).toEqual('custom text field')
})

test('TEST: content as button with custom field', async () => {
  const sut = testContentful()
  const text = await sut.text(
    TEXT_WITH_CONTENT_AS_BUTTON_WITH_CUSTOM_FIELD_ID,
    testContext()
  )
  expect(text.buttons[0].customFields.customFieldText).toEqual(
    'This text is from a custom field'
  )
})
