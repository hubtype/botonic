import { testContentful, testContext } from '../contentful.helper'

const TEST_VIDEO = '41VjWsD8wJLeOx4EQsGMVr'

test('TEST: contentful video', async () => {
  const sut = testContentful()
  const video = await sut.video(TEST_VIDEO, testContext())
  expectVideoUrlIs(video.videoUrl!, 'video.mp4')
  expect(video.common.customFields).toEqual({
    customFieldText: 'custom field test',
  })
})

export function expectVideoUrlIs(url: string, expectedFileName: string): void {
  const urlChunks = url.split('/')
  expect(urlChunks[0]).toBe('https:')
  expect(urlChunks[urlChunks.length - 1]).toBe(expectedFileName)
}
