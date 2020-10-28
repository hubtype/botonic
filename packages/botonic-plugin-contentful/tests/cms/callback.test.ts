import * as cms from '../../src'
import {
  CmsException,
  ContentCallback,
  ContentId,
  ContentType,
  ResourceId,
  TopContentId,
} from '../../src'

test('TEST: Callback.empty', () => {
  const callback = cms.Callback.empty()
  expect(callback.url).toBeUndefined()
  expect(callback.payload).toBeUndefined()
})

test('TEST: Callback.ofUrl', () => {
  const callback = cms.Callback.ofUrl('http:...')
  expect(callback.url).toEqual('http:...')
  expect(() => cms.Callback.ofUrl('')).toThrow(CmsException)
})

test('TEST: Callback.ofPayload', () => {
  const callback = cms.Callback.ofPayload('text$text1')
  expect(callback).toBeInstanceOf(ContentCallback)
  expect((callback as ContentCallback).id).toEqual('text1')
  expect((callback as ContentCallback).model).toEqual(ContentType.TEXT)
})

test('TEST: regexForModel', () => {
  const callback = new cms.ContentCallback(ContentType.CAROUSEL, 'id1')
  expect(
    cms.ContentCallback.regexForModel(ContentType.CAROUSEL).test(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      callback.payload!
    )
  ).toBeTruthy()
})

test('TEST: ResourceId.create', () => {
  expect(ResourceId.create(ContentType.TEXT, 'id')).toBeInstanceOf(TopContentId)

  expect(ResourceId.create(ContentType.BUTTON, 'id')).toBeInstanceOf(ContentId)
  expect(ResourceId.create(ContentType.BUTTON, 'id')).not.toBeInstanceOf(
    TopContentId
  )

  expect(ResourceId.create('resource', 'id')).not.toBeInstanceOf(ContentId)
})
