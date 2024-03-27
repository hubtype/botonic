import { ContentType, MESSAGE_CONTENT_TYPES, TopContentId } from '../../src/cms'
import { ENGLISH, SPANISH } from '../../src/nlp'
import { testContentful } from './contentful.helper'
import { TEST_POST_FAQ1_ID } from './contents/text.test'

const TEST_IMAGE = '3xjvpC7d7PYBmiptEeygfd'

test('TEST: contentful delivery checks that we get the requested message type', async () => {
  const sut = testContentful()

  for (const model of MESSAGE_CONTENT_TYPES) {
    const callback = new TopContentId(model, TEST_IMAGE)
    const content = callback.deliver(sut, { locale: 'es' })
    if (model == ContentType.IMAGE) {
      await content
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      await expect(content).rejects.toThrow()
    }
  }
}, 10000)

test('TEST: contentful cmsLocale', async () => {
  const sut = testContentful({ cmsLocale: _locale => ENGLISH })

  const text = await sut.text(TEST_POST_FAQ1_ID, { locale: SPANISH })

  expect(text.text).toEqual('How to find your order')
})
