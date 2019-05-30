import { instance, mock, when } from 'ts-mockito';
import * as cms from '../../src';
import { DummyCMS, ErrorReportingCMS, ModelType } from '../../src';

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

test('TEST: regexForModel', async () => {
  let callback = new cms.ContentCallback(ModelType.CAROUSEL, 'id1');
  expect(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cms.ContentCallback.regexForModel(ModelType.CAROUSEL).test(
      callback.payload!
    )
  ).toBeTruthy();
});
