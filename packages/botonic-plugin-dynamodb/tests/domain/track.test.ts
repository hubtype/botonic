import { instance, mock, when } from 'ts-mockito'

import { ErrorReportingTrackStorage, Track } from '../../src/domain/track'
import { DynamoTrackStorage } from '../../src/infrastructure/dynamo'
import DoneCallback = jest.DoneCallback
import { TrackException } from '../../src/domain/exceptions'

// next line avoids refactor as per https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-done-callback.md
// eslint-disable-next-line jest/no-done-callback
test('TEST: ErrorReportingCMS write rejected', async (done: DoneCallback) => {
  const mockStorage = mock(DynamoTrackStorage)
  const error = new Error('mock error')
  const track = new Track('botid', new Date(), [])
  when(mockStorage.write(track)).thenReject(error)
  const sut = new ErrorReportingTrackStorage(instance(mockStorage))

  // act
  const promise = sut.write(track)

  // assert
  await promise
    .then(() => {
      done.fail('should have thrown')
      return
    })
    .catch(error2 => {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error2).toBeInstanceOf(TrackException)
      const trackException = error2 as TrackException
      // eslint-disable-next-line jest/no-conditional-expect
      expect(trackException.reason).toBe(error)
      done()
    })
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
