import { instance, mock, when } from 'ts-mockito';
import { DynamoTrackStorage } from '../../src/infrastructure/dynamo';
import { ErrorReportingTrackStorage, Track } from '../../src/domain/track';

test('TEST: ErrorReportingCMS write rejected', async () => {
  let mockStorage = mock(DynamoTrackStorage);
  let error = new Error('mock error');
  let track = instance(mock(Track));
  when(mockStorage.write(track)).thenReject(error);
  let sut = new ErrorReportingTrackStorage(instance(mockStorage));

  // act
  let promise = sut.write(track);

  // assert
  await promise
    .then(c => {
      fail('should have thrown');
    })
    .catch(error2 => {
      expect(error2).toBe(error);
    });
});

test('TEST: ErrorReportingCMS write success', async () => {
  let mockStorage = mock(DynamoTrackStorage);
  let track = instance(mock(Track));
  when(mockStorage.write(track)).thenResolve(undefined);
  let sut = new ErrorReportingTrackStorage(instance(mockStorage));

  // act
  let promise = sut.write(track);

  // assert
  await expect(promise).resolves.toBeUndefined();
});
