import { ContentCallback, ContentType } from '../../../src/cms'
import { ENGLISH } from '../../../src/nlp'
import { testContentful, testContext } from '../contentful.helper'
import { TEST_SORRY } from './text.test'

export const RATING_1STAR_ID = '6JYiydi8JhveDAjDSQ2fp4'

test('TEST: contentful standalone button', async () => {
  const sut = testContentful()

  const button = await sut.button('40buQOqp9jbwoxmMZhFO16', { locale: ENGLISH })
  expect(button.text).toEqual('Return an article')
  expect(button.name).toEqual('POST_FAQ3')
  expect(button.callback).toEqual(
    new ContentCallback(ContentType.TEXT, 'C39lEROUgJl9hHSXKOEXS')
  )
  expect(button.toString()).toEqual(
    "'40buQOqp9jbwoxmMZhFO16/POST_FAQ3' to content 'payload:text$C39lEROUgJl9hHSXKOEXS'"
  )
})

test('TEST: button from direct reference to target', async () => {
  const sut = testContentful()
  const text = await sut.text(TEST_SORRY, testContext())
  expect(text.buttons[0].toString()).toEqual(
    "to 'payload:text$3lzJqY4sI3VDgMRFsgvtvT'"
  )
})
