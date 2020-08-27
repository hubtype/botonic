import { instance, mock } from 'ts-mockito'
import { CmsException, ContentCallback, ContentType } from '../../src'
import * as cms from '../../src'

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

test('TEST: callbackMap multiple callbacks', () => {
  const callback1 = mock(cms.Callback)
  const sut = new cms.CallbackMap().addCallback('id1', callback1)
  expect(sut.getCallback('id1')).toBe(callback1)

  const callback2 = mock(cms.Callback)
  sut.addCallback('id2', callback2)
  expect(sut.getCallback('id2')).toBe(callback2)
})

test('TEST: callbackMap fixed callback', () => {
  const callback = instance(mock(cms.Callback))
  const sut = cms.CallbackMap.forAllIds(callback)
  expect(sut.getCallback(Math.random().toString())).toBe(callback)
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
