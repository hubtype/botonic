import BotonicPluginContentful, {
  ErrorReportingCMS,
  LogCMS,
  multiEnvironmentFactory,
} from '../src'
import { MultiContextCms } from '../src/cms/cms-multilocale'
import {
  TEST_DEFAULT_LOCALE,
  TEST_NON_DEFAULT_LOCALE,
  testAccessToken,
  testContentful,
  testContentfulOptions,
  testSpaceId,
} from './contentful/contentful.helper'
import { TEST_CAROUSEL_MAIN_ID } from './contentful/contents/carousel.test'

test('TEST: plugin with logCalls', async () => {
  const sut = new BotonicPluginContentful(
    testContentfulOptions({ logCalls: true })
  )
  expect(sut.cms).toBeInstanceOf(ErrorReportingCMS)
  const contentful = (sut.cms as ErrorReportingCMS).cms
  expect(contentful).toBeInstanceOf(LogCMS)

  const carousel = await sut.cms.carousel(TEST_CAROUSEL_MAIN_ID, {
    locale: TEST_DEFAULT_LOCALE,
  })
  expect(carousel.common.id).toEqual(TEST_CAROUSEL_MAIN_ID)
})

test('INTEGRATION TEST plugin with contentfulFactory', async () => {
  // Arrange
  const otherEnvironmentCredentials = {
    spaceId: testSpaceId(),
    environment: 'testx',
    accessToken: testAccessToken(),
  }
  const opts = testContentfulOptions({
    contentfulFactory: multiEnvironmentFactory({
      [TEST_NON_DEFAULT_LOCALE]: otherEnvironmentCredentials,
    }),
  })
  const defaultCMS = testContentful()
  const defaultContent = await defaultCMS.carousel(TEST_CAROUSEL_MAIN_ID)
  const otherEnvironmentCMS = testContentful(otherEnvironmentCredentials)

  // Act
  const sut = new BotonicPluginContentful(opts).cms
  expect(sut).toBeInstanceOf(ErrorReportingCMS)
  expect((sut as ErrorReportingCMS).cms).toBeInstanceOf(MultiContextCms)

  // // Assert
  // //specifying the default locale
  expect(
    await sut.carousel(TEST_CAROUSEL_MAIN_ID, {
      locale: TEST_DEFAULT_LOCALE,
    })
  ).toEqual(defaultContent)

  //
  // // alternate locale
  // // maybe we could write on contentful to doublecheck that we're reading from a given space/environment
  const nonDefaultContent = await otherEnvironmentCMS.carousel(
    TEST_CAROUSEL_MAIN_ID,
    {
      locale: TEST_NON_DEFAULT_LOCALE,
    }
  )
  expect(nonDefaultContent.common.shortText).not.toEqual(
    defaultContent.common.shortText
  )
  expect(
    await sut.carousel(TEST_CAROUSEL_MAIN_ID, {
      locale: TEST_NON_DEFAULT_LOCALE,
    })
  ).toEqual(nonDefaultContent)
})
