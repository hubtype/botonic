import Contentful from '../../src/contentful';

export function testSpaceId(): string {
  return 's1zkp12rqz4o'; //process.env.CONTENTFUL_TEST_SPACE_ID!;
}

export function testContentful(): Contentful {
  return new Contentful(
    testSpaceId(),
    'Q7K3ly6oEr7k-ER9b68U2gFuhdZCDC9ZNP68oWMXf6Y', //process.env.CONTENTFUL_TEST_TOKEN!,
    2000
  );
}
