import {
  Button,
  Callback,
  CommonFields,
  ContentCallback,
  ContentType,
  TopContentType,
  Queue,
  Text,
} from '../../src/cms'
import { testContentful, testContext } from './contentful.helper'

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
  const empezar = buttons.filter(b => b.id == '40buQOqp9jbwoxmMZhFO16')
  expect(empezar[0]).toEqual(
    new Button(
      '40buQOqp9jbwoxmMZhFO16',
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
  expect(
    results.filter(result => !(result.callback instanceof ContentCallback))
  ).toHaveLength(1)
  const contentResults = results.filter(
    result => result.callback instanceof ContentCallback
  )
  const ofType = (model: TopContentType) =>
    contentResults.filter(r => (r.callback as ContentCallback).model == model)

  expect(ofType(ContentType.CAROUSEL)).toHaveLength(1)
  expect(ofType(ContentType.TEXT)).toHaveLength(15)
  expect(ofType(ContentType.CHITCHAT)).toHaveLength(0)
  expect(ofType(ContentType.URL)).toHaveLength(0)
  expect(ofType(ContentType.SCHEDULE)).toHaveLength(0)
  expect(ofType(ContentType.DATE_RANGE)).toHaveLength(0)
  expect(ofType(ContentType.IMAGE)).toHaveLength(0)
  expect(ofType(ContentType.QUEUE)).toHaveLength(2)
}, 15000)
