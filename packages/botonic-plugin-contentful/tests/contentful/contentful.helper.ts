import Contentful from '../../src/contentful';
import { Context } from '../../src/cms';

export function testSpaceId(): string {
  return process.env.CONTENTFUL_TEST_SPACE_ID!;
}

export function testContentful(): Contentful {
  // useful to have long timeouts so that we can send many requests simultaneously
  return new Contentful(
    testSpaceId(),
    process.env.CONTENTFUL_TEST_TOKEN!,
    2000
  );
}

export function testContext(
  contexts: (Context | undefined)[] = [
    { locale: 'es' },
    { locale: 'en' },
    {},
    undefined
  ]
): Context | undefined {
  let index = Math.floor(Math.random() * contexts.length);

  return contexts[index];
}
