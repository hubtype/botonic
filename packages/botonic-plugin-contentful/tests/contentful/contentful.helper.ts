import { Contentful } from '../../src/contentful'
import { CMS, Context, ErrorReportingCMS } from '../../src/cms'
import { ContentfulOptions, ENGLISH, SPANISH } from '../../src'

export function testSpaceId(): string {
  return process.env.CONTENTFUL_TEST_SPACE_ID!
}

export function testContentful(
  options: Partial<ContentfulOptions> = {},
  errorReporting = true
): CMS {
  const contentful = new Contentful(testContentfulOptions(options))
  if (!errorReporting) {
    return contentful
  }
  return new ErrorReportingCMS(contentful)
}

export function testContentfulOptions(
  options: Partial<ContentfulOptions> = {}
): ContentfulOptions {
  // useful to have long timeouts so that we can send many requests simultaneously
  return {
    ...{
      spaceId: testSpaceId(),
      accessToken: process.env.CONTENTFUL_TEST_TOKEN!,
      environment: 'master',
    },
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
