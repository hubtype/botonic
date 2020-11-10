import {
  BOTONIC_CONTENT_TYPES,
  ContentCallback,
  ContentType,
  Context,
} from '../../src/cms'
import { ButtonFields } from '../../src/contentful/contents/button'
import { TextFields } from '../../src/contentful/contents/text'
import { AdaptorDeliveryApi } from '../../src/contentful/delivery-api'
import { createContentfulClientApi } from '../../src/contentful/delivery-utils'
import { IgnoreFallbackDecorator } from '../../src/contentful/ignore-fallback-decorator'
import { ENGLISH, Locale, SPANISH } from '../../src/nlp'
import { testContentful, testContentfulOptions } from './contentful.helper'
import {
  TEST_CAROUSEL_MAIN_ID,
  TEST_POST_MENU_CRSL,
} from './contents/carousel.test'
import { TEST_NO_SPANISH_TEXT } from './contents/text.test'

export const TEST_BUTTON_BLANK_SPANISH = '40buQOqp9jbwoxmMZhFO16'

function createIgnoreFallbackDecorator() {
  const options = testContentfulOptions()
  return new IgnoreFallbackDecorator(
    new AdaptorDeliveryApi(createContentfulClientApi(options), options)
  )
}

const FALLBACK_TESTS = [
  [{ locale: ENGLISH, ignoreFallbackLocale: true }, 'Return an article'],
  [{ locale: SPANISH, ignoreFallbackLocale: true }, ''],
  [{}, 'Return an article'],
  [{ locale: ENGLISH }, 'Return an article'],
  [{ locale: SPANISH }, 'Return an article'], // fallback
]

test.each<any>(FALLBACK_TESTS)(
  'TEST: IgnoreFallbackDecorator.getEntry<ButtonFields> uses fallback locale',
  async (context: Context, expectedText: string) => {
    const sut = createIgnoreFallbackDecorator()

    // act
    const entry = await sut.getEntry<ButtonFields>(
      TEST_BUTTON_BLANK_SPANISH,
      context
    )

    // assert
    expect(entry.fields.text).toEqual(expectedText)
    expect(entry.fields.name).toEqual('POST_FAQ3')
  }
)

test('TEST: ignoreFallbackLocale with a carousel with buttons to other carousels', async () => {
  const contentful = testContentful()
  const carousel = await contentful.carousel(TEST_CAROUSEL_MAIN_ID, {
    locale: SPANISH,
    ignoreFallbackLocale: true,
  })
  const elementPost = carousel.elements.find(
    e => e.id == '6aOPY3UVh8M4lihW9xe17E'
  )
  expect(elementPost).toBeDefined()
  expect(elementPost!.buttons).toHaveLength(1)
  expect(elementPost!.buttons[0].callback).toEqual(
    new ContentCallback(ContentType.CAROUSEL, TEST_POST_MENU_CRSL)
  )
})

test.each<any>([ENGLISH, SPANISH])(
  'TEST: ignoreFallbackLocale all contents %s',
  async (locale: Locale) => {
    const contentful = testContentful()
    for (const model of BOTONIC_CONTENT_TYPES) {
      const ret = await contentful.contents(model, {
        locale,
        ignoreFallbackLocale: true,
      })
      for (const content of ret) {
        expect(content.id).toBeDefined()
        expect(content.name).toBeDefined()
      }
    }
  },
  30000
)

test('TEST: IgnoreFallbackDecorator.getEntry<TextFields> uses fallback locale', async () => {
  const sut = createIgnoreFallbackDecorator()

  // act
  const entry = await sut.getEntry<TextFields>(TEST_NO_SPANISH_TEXT, {
    locale: SPANISH,
    ignoreFallbackLocale: true,
  })

  // assert
  expect(entry.fields.text).toEqual('')
  expect(entry.fields.name).toEqual('TEST_NO_SPANISH_TEXT')
  // references do not fallback
  expect(entry.fields.buttons).toBeUndefined()
})

test.each<any>(FALLBACK_TESTS)(
  'TEST: IgnoreFallbackDecorator.getEntries<ButtonFields> uses fallback locale',
  async (context: Context, expectedText: string) => {
    const sut = createIgnoreFallbackDecorator()

    // acr
    const entries = await sut.getEntries<ButtonFields>(context, {
      content_type: ContentType.BUTTON,
    })

    //assert
    const entry = entries.items.filter(
      e => e.sys.id == TEST_BUTTON_BLANK_SPANISH
    )
    expect(entry.length).toBe(1)
    expect(entry[0].fields.text).toEqual(expectedText)
    expect(entry[0].fields.name).toEqual('POST_FAQ3')
  }
)

test('hack because webstorm does not recognize test.skip.each', () => {})
