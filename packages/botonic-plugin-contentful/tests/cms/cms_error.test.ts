import { instance, mock, when } from 'ts-mockito';
import { DummyCMS, ErrorReportingCMS } from '../../src';

test('TEST: ErrorReportingCMS', async () => {
  let mockCms = mock(DummyCMS);
  let error = new Error('mock error');
  when(mockCms.carousel('id1', undefined)).thenReject(error);
  let sut = new ErrorReportingCMS(instance(mockCms));

  await sut
    .carousel('id1')
    .then(({}) => {
      fail('should have thrown');
    })
    .catch((error2: any) => {
      expect(error2).toBe(error);
    });
});
