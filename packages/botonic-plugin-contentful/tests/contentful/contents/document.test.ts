import { TEST_DEFAULT_LOCALE, testContentful } from '../contentful.helper'

const TEST_DOCUMENT = '2H9ACmk3tf82KAzx5z5eYX'

test('TEST: contentful document', async () => {
  const sut = testContentful()
  const document = await sut.document(TEST_DOCUMENT, {
    locale: TEST_DEFAULT_LOCALE,
  })
  expectDocUrlIs(document.docUrl!, 'srp.pdf')
  expect(document.common.customFields).toEqual({
    customFieldText: 'Custom data',
  })
})

export function expectDocUrlIs(url: string, expectedFileName: string): void {
  const urlChunks = url.split('/')
  expect(urlChunks[0]).toBe('https:')
  expect(urlChunks[urlChunks.length - 1]).toBe(expectedFileName)
}
