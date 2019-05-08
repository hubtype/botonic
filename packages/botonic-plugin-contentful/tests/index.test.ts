import { TEST_CAROUSEL_MAIN_ID } from './contentful/contentful.test';
import * as contentful from '../src/index';

test('TEST: main', async () => {
  let plugin = new contentful.default({
    spaceId: process.env.CONTENTFUL_TEST_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_TEST_TOKEN!
  });
  let carousel = await plugin.cms.carousel(TEST_CAROUSEL_MAIN_ID);
  expect(carousel.name).toBe('INICIO');
});
