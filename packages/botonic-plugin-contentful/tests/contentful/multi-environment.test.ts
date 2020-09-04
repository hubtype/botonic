import { testContentful, testContentfulOptions } from './contentful.helper'
import { CMS } from '../../src/cms'
import { MultiEnvironmentFactory } from '../../src/contentful/multi-environment'
import { ContentfulOptions, Locale } from '../../src'
import { instance, mock } from 'ts-mockito'

test('TEST: MultiEnvironmentFactory', () => {
  // Arrange
  const opts = testContentfulOptions()
  const cmsBySpaceId: {
    [spaceId: string]: CMS
  } = {}
  const sut = new MultiEnvironmentFactory(
    {
      cms1: testContentfulOptions({ spaceId: 'cms1' }),
    },
    (opts: ContentfulOptions) => {
      // each space should be configured only once
      expect(cmsBySpaceId[opts.spaceId]).toBeUndefined()
      cmsBySpaceId[opts.spaceId] = instance(mock<CMS>())
      return cmsBySpaceId[opts.spaceId]
    }
  )

  // Act/Assert create CMS from opts.environmentByLocale
  const cms1 = sut.get(opts, { locale: 'cms1' })
  expect(cms1).toBe(cmsBySpaceId['cms1'])

  // Act/Assert CMS only created once per each locale
  expect(sut.get(opts, { locale: 'cms1' })).toBe(cms1)

  // Act/Assert bad locale returns default CMS
  const defaultCMS = sut.get(opts, { locale: 'cms2' })
  expect(defaultCMS).toBe(cmsBySpaceId[opts.spaceId])
  // default CMS also cached
  expect(sut.get(opts, { locale: 'loc2' })).toBe(defaultCMS)

  // Act/Assert no locale returns default CMS
  expect(sut.get(opts, { ignoreFallbackLocale: true })).toBe(defaultCMS)

  // Act/Assert no context returns default CMS
  expect(sut.get(opts, undefined)).toBe(defaultCMS)
})

test('TEST: MultiEnvironmentFactory keeps functions in options', () => {
  // Arrange
  const cms = testContentful()
  class MyContentfulOptions implements ContentfulOptions {
    cmsLocale(locale?: Locale): Locale | undefined {
      return locale
    }

    accessToken = 'token'
    spaceId = 'spaceId'
  }

  const sut = new MultiEnvironmentFactory(
    undefined,
    (opts: ContentfulOptions) => {
      // since MultiEnvironmentFactory clones the ContentfulOptions, we want to make
      // sure that it keeps their functions
      expect(opts.cmsLocale!('kk')).toEqual('kk')
      return cms
    }
  )

  // act
  const created = sut.get(new MyContentfulOptions())

  // assert
  expect(created).toBe(cms)
  expect.assertions(2)
})
