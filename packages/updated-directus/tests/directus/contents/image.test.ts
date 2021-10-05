import { testDirectus, testContext } from '../helpers/directus.helper'

const TEST_IMAGE = 'ce1c96b1-a933-4e6e-85f4-f7070eaba84c'

type CustomFieldImageJson = {
  isImage: boolean
  text: string
}
test('TEST: contentful image with JSON custom field', async () => {
  const directus = testDirectus()
  const image = await directus.image(TEST_IMAGE, testContext())
  expectImgUrlIs(image.imgUrl, 'a3c5da57-d285-4a30-a036-447485d6e4f1')
  expect(
    (image.common.customFields!.customfieldimagejson as CustomFieldImageJson)
      .text
  ).toEqual('this is a JSON custom field')
  expect(
    (image.common.customFields!.customfieldimagejson as CustomFieldImageJson)
      .isImage
  ).toEqual(true)
})

export function expectImgUrlIs(url: string, expectedFileName: string): void {
  const urlChunks = url.split('/')
  expect(urlChunks[0]).toBe('http:')
  expect(urlChunks[urlChunks.length - 1]).toBe(expectedFileName)
}
