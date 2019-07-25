import { instance, mock } from 'ts-mockito';
import { ContentCallback, ModelType } from '../../src';
import * as cms from '../../src';

test('TEST: ofPayload', () => {
  let callback = cms.Callback.ofPayload('text$text1');
  expect(callback).toBeInstanceOf(ContentCallback);
  expect((callback as ContentCallback).id).toEqual('text1');
  expect((callback as ContentCallback).model).toEqual(ModelType.TEXT);
});

test('TEST: callbackMap multiple callbacks', () => {
  let callback1 = mock(cms.Callback);
  let sut = new cms.CallbackMap().addCallback('id1', callback1);
  expect(sut.getCallback('id1')).toBe(callback1);

  let callback2 = mock(cms.Callback);
  sut.addCallback('id2', callback2);
  expect(sut.getCallback('id2')).toBe(callback2);
});

test('TEST: callbackMap fixed callback', () => {
  let callback = instance(mock(cms.Callback));
  let sut = cms.CallbackMap.forAllIds(callback);
  expect(sut.getCallback(Math.random().toString())).toBe(callback);
});

test('TEST: regexForModel', () => {
  let callback = new cms.ContentCallback(ModelType.CAROUSEL, 'id1');
  expect(
    cms.ContentCallback.regexForModel(ModelType.CAROUSEL).test(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      callback.payload!
    )
  ).toBeTruthy();
});
