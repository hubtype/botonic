import { testDirectus, testContext } from '../helpers/directus'

const TEST_IMAGE = '7e194cc0-bf97-4478-ae59-44f19e55a8ae'

type CustomFieldImageJson = {
  isImage: boolean
  text: string
}
test('TEST: contentful image with JSON custom field', async () => {
  const directus = testDirectus()
  const image = await directus.image(TEST_IMAGE, testContext())
  expectImgUrlIs(image.image, 'b1d851d0-57d2-43ee-973e-954192b2cc6a')
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
