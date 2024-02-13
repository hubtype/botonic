import { instance, mock, when } from 'ts-mockito'

import { ErrorReportingTrackStorage, Track } from '../../src/domain/track'
import { DynamoTrackStorage } from '../../src/infrastructure/dynamo'
import { TrackException } from '../../src/domain/exceptions'

test('TEST: ErrorReportingCMS write rejected', async () => {
  const mockStorage = mock(DynamoTrackStorage)
  const error = new Error('mock error')
  const track = new Track('botid', new Date(), [])
  when(mockStorage.write(track)).thenReject(error)
  const sut = new ErrorReportingTrackStorage(instance(mockStorage))

  // act
  const promise = sut.write(track)

  // assert
  try {
    await promise
    fail('should have thrown')
  } catch (error2) {
    expect(error2).toBeInstanceOf(TrackException)
    const trackException = error2 as TrackException
    expect(trackException.reason).toBe(error)
  }
})

test('TEST: ErrorReportingCMS write success', async () => {
  const mockStorage = mock(DynamoTrackStorage)
  const track = instance(mock(Track))
  when(mockStorage.write(track)).thenResolve(undefined)
  const sut = new ErrorReportingTrackStorage(instance(mockStorage))

  // act
  const promise = sut.write(track)

  // assert
  await expect(promise).resolves.toBeUndefined()
})
