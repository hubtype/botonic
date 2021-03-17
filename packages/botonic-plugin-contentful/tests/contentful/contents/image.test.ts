import { testContentful, testContext } from '../contentful.helper'

const TEST_IMAGE = '3xjvpC7d7PYBmiptEeygfd'

test('TEST: contentful image', async () => {
  const sut = testContentful()
  const image = await sut.image(TEST_IMAGE, testContext())
  expectImgUrlIs(image.imgUrl, 'red.jpg')
  expect(image.common.customFields).toEqual({
    customFieldRichText: 'This is rich text',
  })
})

export function expectImgUrlIs(url: string, expectedFileName: string): void {
  const urlChunks = url.split('/')
  expect(urlChunks[0]).toBe('https:')
  expect(urlChunks[urlChunks.length - 1]).toBe(expectedFileName)
}
