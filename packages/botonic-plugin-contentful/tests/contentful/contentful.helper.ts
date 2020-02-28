import Contentful from '../../src/contentful'
import { Context } from '../../src/cms'
import { ContentfulOptions } from '../../src'

export function testSpaceId(): string {
  return process.env.CONTENTFUL_TEST_SPACE_ID!
}

export function testContentful(
  options: Partial<ContentfulOptions> = {}
): Contentful {
  return new Contentful(testContentfulOptions(options))
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
