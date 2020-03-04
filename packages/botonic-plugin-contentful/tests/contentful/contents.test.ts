import {
  Button,
  Callback,
  CommonFields,
  ContentType,
  TopContentType,
  Queue,
  Text,
  ContentCallback,
} from '../../src/cms'
import { testContentful, testContext } from './contentful.helper'

const BUTTON_POST_FAQ3 = '40buQOqp9jbwoxmMZhFO16'

test('TEST: contentful contents buttons', async () => {
  const buttons = await testContentful().contents(ContentType.BUTTON, {
    locale: 'en',
  })
  expect(buttons).toSatisfyAll(button => button instanceof Button)
  expect(buttons.length).toEqual(32)

  const star = buttons.filter(b => b.id == '6JYiydi8JhveDAjDSQ2fp4')
  expect(star[0]).toEqual(
    new Button(
      '6JYiydi8JhveDAjDSQ2fp4',
      'STAR_1',
      '⭐',
      Callback.ofPayload('RATING_1')
    )
  )
  const empezar = buttons.filter(b => b.id == BUTTON_POST_FAQ3)
  expect(empezar[0]).toEqual(
    new Button(
      BUTTON_POST_FAQ3,
      'POST_FAQ3',
      'Return an article',
      new ContentCallback(ContentType.TEXT, 'C39lEROUgJl9hHSXKOEXS')
    )
  )
})

test('TEST: contentful topContents filter', async () => {
  const filter = (cf: CommonFields) => cf.name.startsWith('POST')
  const texts = await testContentful().topContents(
    ContentType.TEXT,
    { locale: 'en' },
    filter
  )
  expect(texts).toSatisfyAll(
    text => text instanceof Text && filter(text.common)
  )

  expect(texts.length).toBeGreaterThanOrEqual(8)
})

test('TEST: contentful topContents no filter', async () => {
  const queues = await testContentful().topContents(ContentType.QUEUE, {
    locale: 'en',
  })
  expect(queues).toSatisfyAll(queue => queue instanceof Queue)
  expect(queues.length).toEqual(1)
})

test('TEST: contentful contentsWithKeywords', async () => {
  // act
  const results = await testContentful().contentsWithKeywords(
    testContext([{ locale: 'en' }, {}, undefined])
  )

  // assert
  expect(results).toHaveLength(19)
  const ofType = (model: TopContentType) =>
    results.filter(r => r.contentId.model == model)

  expect(ofType(ContentType.CAROUSEL)).toHaveLength(1)
  expect(ofType(ContentType.TEXT)).toHaveLength(15)
  expect(ofType(ContentType.CHITCHAT)).toHaveLength(0)
  expect(ofType(ContentType.URL)).toHaveLength(1)
  expect(ofType(ContentType.SCHEDULE)).toHaveLength(0)
  expect(ofType(ContentType.DATE_RANGE)).toHaveLength(0)
  expect(ofType(ContentType.IMAGE)).toHaveLength(0)
  expect(ofType(ContentType.QUEUE)).toHaveLength(2)
}, 15000)
