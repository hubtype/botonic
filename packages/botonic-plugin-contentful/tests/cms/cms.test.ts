import { instance, mock, when } from 'ts-mockito';
import * as cms from '../../src';
import { DummyCMS, ErrorReportingCMS, ModelType } from '../../src';

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

test('TEST: ErrorReportingCMS', async () => {
  let mockCms = mock(DummyCMS);
  let error = new Error('mock error');
  when(mockCms.carousel('id1', undefined)).thenReject(error);
  let sut = new ErrorReportingCMS(instance(mockCms));

  await sut
    .carousel('id1')
    .then(c => {
      fail('should have thrown');
    })
    .catch(error2 => {
      expect(error2).toBe(error);
    });
});

test('TEST: regexForModelType', async () => {
  let callback = cms.Callback.ofModel(ModelType.CAROUSEL, 'id1');
  expect(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cms.Callback.regexForModelType(ModelType.CAROUSEL).test(callback.payload!)
  ).toBeTruthy();
});
