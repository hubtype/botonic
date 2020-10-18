import { testContentful } from '../contentful.helper'
import { ENGLISH } from '../../../src/nlp'
import { ContentCallback, ContentType } from '../../../src/cms'

export const RATING_1STAR_ID = '6JYiydi8JhveDAjDSQ2fp4'

test('TEST: contentful button', async () => {
  const sut = testContentful()

  const button = await sut.button('40buQOqp9jbwoxmMZhFO16', { locale: ENGLISH })
  expect(button.text).toEqual('Return an article')
  expect(button.name).toEqual('POST_FAQ3')
  expect(button.callback).toEqual(
    new ContentCallback(ContentType.TEXT, 'C39lEROUgJl9hHSXKOEXS')
  )
})
