import { ContentfulOptions, ENGLISH, SPANISH } from '../../src'
import { CMS, Context } from '../../src/cms'
import { CmsInfo } from '../../src/cms/cms-info'
import { createCms, createCmsInfo } from '../../src/contentful/factories'

export function testSpaceId(): string {
  return process.env.CONTENTFUL_TEST_SPACE_ID!
}

export function testAccessToken(): string {
  return process.env.CONTENTFUL_TEST_TOKEN!
}

export function testContentful(
  options: Partial<ContentfulOptions> = {},
  errorReporting = true
): CMS {
  return createCms(testContentfulOptions(options), errorReporting)
}

export function testContentfulInfo(
  options: Partial<ContentfulOptions> = {}
): CmsInfo {
  return createCmsInfo(testContentfulOptions(options))
}

export function testContentfulOptions(
  options: Partial<ContentfulOptions> = {}
): ContentfulOptions {
  // useful to have long timeouts so that we can send many requests simultaneously
  return {
    spaceId: testSpaceId(),
    accessToken: testAccessToken(),
    environment: 'master',
    ...options,
  }
}

export const TEST_DEFAULT_LOCALE = ENGLISH
export const TEST_NON_DEFAULT_LOCALE = SPANISH

export function testContext(
  contexts: (Context | undefined)[] = [
    { locale: 'es' },
    { locale: 'en' },
    {},
    undefined,
  ]
): Context | undefined {
  const index = Math.floor(Math.random() * contexts.length)

  return contexts[index]
}
