import BotonicPluginContentful, {
  Contentful,
  ErrorReportingCMS,
  multiEnvironmentFactory,
} from '../src'
import {
  TEST_DEFAULT_LOCALE,
  TEST_NON_DEFAULT_LOCALE,
  testContentful,
  testContentfulOptions,
} from './contentful/contentful.helper'
import { MultiContextCms } from '../src/cms/cms-multilocale'
import { TEST_CAROUSEL_MAIN_ID } from './contentful/contents/carousel.test'

test('TEST plugin', () => {
  const sut = new BotonicPluginContentful(testContentfulOptions())
  expect(sut.cms).toBeInstanceOf(ErrorReportingCMS)
  const contentful = (sut.cms as ErrorReportingCMS).cms
  expect(contentful).toBeInstanceOf(Contentful)
})

test('INTEGRATION TEST plugin with contentfulFactory', () => {
  // Arrange
  const opts = testContentfulOptions({
    contentfulFactory: multiEnvironmentFactory({
      [TEST_NON_DEFAULT_LOCALE]: testContentfulOptions({
        environment: 'testx',
      }),
    }),
  })
  const defaultCMS = testContentful()
  const defaultContent = defaultCMS.carousel(TEST_CAROUSEL_MAIN_ID)
  const nonDefaultContent = defaultCMS.carousel(TEST_CAROUSEL_MAIN_ID, {
    locale: TEST_DEFAULT_LOCALE,
  })

  // Act
  const sut = new BotonicPluginContentful(opts)
  expect(sut.cms).toBeInstanceOf(ErrorReportingCMS)
  const multiCms = (sut.cms as ErrorReportingCMS).cms as MultiContextCms
  expect(multiCms).toBeInstanceOf(MultiContextCms)

  // // Assert
  // //specifying the default locale
  expect(
    multiCms.carousel(TEST_CAROUSEL_MAIN_ID, {
      locale: TEST_DEFAULT_LOCALE,
    })
  ).toEqual(defaultContent)
  //
  // // alternate locale
  // // maybe we could write on contentful to doublecheck that we're reading from a given space/environment
  expect(
    multiCms.carousel(TEST_CAROUSEL_MAIN_ID, {
      locale: TEST_NON_DEFAULT_LOCALE,
    })
  ).toEqual(nonDefaultContent)
})
