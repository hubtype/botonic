import Contentful from '../../src/contentful';

export function testSpaceId(): string {
  return process.env.CONTENTFUL_TEST_SPACE_ID!;
}
export function testContentful(): Contentful {
  return new Contentful(
    testSpaceId(),
    process.env.CONTENTFUL_TEST_TOKEN!,
    2000
  );
}
