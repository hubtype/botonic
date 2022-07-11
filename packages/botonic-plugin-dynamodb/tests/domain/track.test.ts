import { instance, mock, when } from 'ts-mockito'

import { TrackException } from '../../src/domain/exceptions'
import { ErrorReportingTrackStorage, Track } from '../../src/domain/track'
import { DynamoTrackStorage } from '../../src/infrastructure/dynamo'
import { getError } from '../helpers/jest'

test(`TEST: An error in writing throws TrackException with reason property`, async () => {
  const mockStorage = mock(DynamoTrackStorage)
  const error = new Error('mock error')
  const track = new Track('botid', new Date(), [])
  when(mockStorage.write(track)).thenReject(error)
  const sut = new ErrorReportingTrackStorage(instance(mockStorage))

  // act
  const errorThrown: TrackException = await getError(() => sut.write(track))

  //assert
  expect(errorThrown).toBeInstanceOf(TrackException)
  expect(errorThrown.reason).toBe(error)
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
