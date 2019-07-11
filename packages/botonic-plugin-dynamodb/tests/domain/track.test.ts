import { instance, mock, when } from 'ts-mockito';
import { DynamoTrackStorage } from '../../src/infrastructure/dynamo';
import { ErrorReportingTrackStorage, Track } from '../../src/domain/track';

test('TEST: ErrorReportingCMS write rejected', async done => {
  const mockStorage = mock(DynamoTrackStorage);
  const error = new Error('mock error');
  const track = new Track('botid', new Date(), []);
  // when(mockStorage.write(track)).thenReject(error);
  when(mockStorage.write(track)).thenResolve(undefined);
  const sut = new ErrorReportingTrackStorage(instance(mockStorage));

  // act
  const promise = sut.write(track);

  // assert
  await promise
    .then(() => {
      done.fail('should have thrown');
    })
    .catch(error2 => {
      expect(error2).toBe(error);
    });
});

test('TEST: ErrorReportingCMS write success', async () => {
  const mockStorage = mock(DynamoTrackStorage);
  const track = instance(mock(Track));
  when(mockStorage.write(track)).thenResolve(undefined);
  const sut = new ErrorReportingTrackStorage(instance(mockStorage));

  // act
  const promise = sut.write(track);

  // assert
  await expect(promise).resolves.toBeUndefined();
});
