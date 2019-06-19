import { testContentful } from './contentful.helper';
import { expectImgUrlIs } from './image.test';

const TEST_ASSET_ID = '1T0ntgNJnDUSwz59zGMZO6';

test('TEST: contentful asset', async () => {
  let sut = testContentful();

  let asset = await sut.asset(TEST_ASSET_ID);

  expectImgUrlIs(asset.url, 'red.jpg');
  expect(asset.type).toEqual('image/jpeg');
  expect(asset.details.size).toEqual(2253);
});
