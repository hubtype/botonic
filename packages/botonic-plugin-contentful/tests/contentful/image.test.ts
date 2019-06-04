import { testContentful } from './contentful.helper';

const TEST_IMAGE = '3xjvpC7d7PYBmiptEeygfd';

test('TEST: contentful image', async () => {
  let sut = testContentful();

  let image = await sut.image(TEST_IMAGE);
  expectImgUrlIs(image.imgUrl, 'red.jpg');
});

export function expectImgUrlIs(url: string, expectedFileName: string): void {
  let urlChunks = url.split('/');
  expect(urlChunks[0]).toBe('https:');
  expect(urlChunks[urlChunks.length - 1]).toBe(expectedFileName);
}
