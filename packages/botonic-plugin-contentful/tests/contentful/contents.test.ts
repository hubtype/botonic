import {
  Button,
  Callback,
  CommonFields,
  ContentType,
  TopContentType,
  Queue,
  Text,
  ContentCallback,
  Content,
} from '../../src/cms'
import { testContentful, testContext } from './contentful.helper'
import { expectContentIsSorryText, TEST_SORRY } from './contents/text.test'
import { RATING_1STAR_ID } from './contents/button.test'

const BUTTON_POST_FAQ3 = '40buQOqp9jbwoxmMZhFO16'

test('TEST: contentful.content subContent', async () => {
  const button = await testContentful().content(RATING_1STAR_ID, {
    locale: 'en',
  })
  expect(button).toBeInstanceOf(Button)
  expectIs1StarButton(button)
})

test('TEST: contentful.content topContent', async () => {
  const content = await testContentful().content(TEST_SORRY, {
    locale: 'en',
  })
  expectContentIsSorryText(content)
})

test('TEST: contentful contents buttons', async () => {
  const buttons = await testContentful().contents(ContentType.BUTTON, {
    locale: 'en',
  })
  expect(buttons).toSatisfyAll(button => button instanceof Button)
  expect(buttons.length).toEqual(32)

  const star = buttons.filter(b => b.id == '6JYiydi8JhveDAjDSQ2fp4')
  expectIs1StarButton(star[0])
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

function expectIs1StarButton(button: Content) {
  expect(button).toEqual(
    new Button(
      '6JYiydi8JhveDAjDSQ2fp4',
      'STAR_1',
      '⭐',
      Callback.ofPayload('RATING_1')
    )
  )
}
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
  expect(results.length).toBeGreaterThanOrEqual(20)
  const ofType = (model: TopContentType) =>
    results.filter(r => r.contentId.model == model)

  expect(ofType(ContentType.CAROUSEL)).toHaveLength(1)
  expect(ofType(ContentType.TEXT).length).toBeGreaterThanOrEqual(15)
  expect(ofType(ContentType.CHITCHAT)).toHaveLength(0)
  expect(ofType(ContentType.URL)).toHaveLength(1)
  expect(ofType(ContentType.SCHEDULE)).toHaveLength(0)
  expect(ofType(ContentType.DATE_RANGE)).toHaveLength(0)
  expect(ofType(ContentType.IMAGE)).toHaveLength(0)
  expect(ofType(ContentType.QUEUE)).toHaveLength(2)
}, 15000)
