import { ContentCallback, ContentType, InputType, SPANISH } from '../../../src'
import { testContentful, testContext } from '../contentful.helper'

const TEST_INPUT_KEYWORDS_ID = '63w30wfwfbUh2As50xygi3'
const TEST_INPUT_INTENTS_ID = '54vzbXIXsmQsfLh7zxkQK6'

describe('Contentful Input', () => {
  test('TEST: contentful keywords input', async () => {
    const sut = testContentful()

    // act
    const input = await sut.input(
      TEST_INPUT_KEYWORDS_ID,
      testContext([{ locale: SPANISH }])
    )

    // assert
    expect(input.common.name).toEqual('INPUT_KEYWORDS_TEST')
    expect(input.title).toEqual('input keywords title')
    expect(input.type).toEqual(InputType.KEYWORDS)
    expect(input.keywords).toEqual(['key1', 'key2', 'key3'])
    expect(input.target).toEqual(
      new ContentCallback(ContentType.TEXT, 'djwHOFKknJ3AmyG6YKNip')
    )
  })

  test('TEST: contentful intents input', async () => {
    const sut = testContentful()

    // act
    const input = await sut.input(
      TEST_INPUT_INTENTS_ID,
      testContext([{ locale: SPANISH }])
    )

    // assert
    expect(input.common.name).toEqual('INPUT_INTENTS_TEST')
    expect(input.title).toEqual('input intents title')
    expect(input.type).toEqual(InputType.INTENTS)
    expect(input.keywords).toEqual(['intent1', 'intent2', 'intent3'])
    expect(input.target).toEqual(
      new ContentCallback(ContentType.CAROUSEL, '2yR9f3stNAEqdamUr8VtfD')
    )
  })
})
