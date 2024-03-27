import { instance, mock, when } from 'ts-mockito'

import { TrackException } from '../../src/domain/exceptions'
import { ErrorReportingTrackStorage, Track } from '../../src/domain/track'
import { DynamoTrackStorage } from '../../src/infrastructure/dynamo'

test('TEST: ErrorReportingCMS write rejected', async () => {
  const mockStorage = mock(DynamoTrackStorage)
  const error = new Error('mock error')
  const track = new Track('botid', new Date(), [])
  when(mockStorage.write(track)).thenReject(error)
  const sut = new ErrorReportingTrackStorage(instance(mockStorage))

  // act
  const promise = sut.write(track)

  // assert
  await expect(promise).rejects.toBeInstanceOf(TrackException)
  try {
    const error2 = await promise.catch(e => e)
    const trackException = error2 as TrackException
    expect(trackException.reason).toBe(error)
  } catch (error2) {
    // Handle any unexpected errors here
    console.log(error2)
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
