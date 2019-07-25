import { instance, mock, when } from 'ts-mockito';
import { Carousel, DummyCMS, ErrorReportingCMS } from '../../src';

test('TEST: ErrorReportingCMS carousel delivery failed', async () => {
  const mockCms = mock(DummyCMS);
  const error = new Error('mock error');
  when(mockCms.carousel('id1', undefined)).thenReject(error);
  const sut = new ErrorReportingCMS(instance(mockCms));

  await sut
    .carousel('id1')
    .then(({}) => {
      fail('should have thrown');
    })
    .catch((error2: any) => {
      expect(error2).toBe(error);
    });
});

test('TEST: ErrorReportingCMS carousel delivery ok', async () => {
  const mockCms = mock(DummyCMS);
  const carousel = mock(Carousel);
  when(carousel.validate()).thenReturn('invalid carousel');

  when(mockCms.carousel('id1', undefined)).thenResolve(instance(carousel));
  const sut = new ErrorReportingCMS(instance(mockCms));

  await sut.carousel('id1').then(c => {
    expect(c).toEqual(instance(carousel));
  });
});
