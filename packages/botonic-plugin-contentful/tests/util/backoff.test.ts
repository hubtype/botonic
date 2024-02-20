import { ExponentialBackoff, repeatWithBackoff } from '../../src/util/backoff'

test('TEST: repeatWithBackoff', async () => {
  let counter = 0
  const NUM_FAILURES = 4
  let loggerCount = 0
  const logger = () => {
    loggerCount++
  }

  // act
  await repeatWithBackoff(
    () => {
      counter++
      if (counter <= NUM_FAILURES) {
        throw new Error('forced error')
      }
      return Promise.resolve()
    },
    new ExponentialBackoff(),
    logger
  )

  // assert
  expect(counter).toEqual(NUM_FAILURES + 1)
  expect(loggerCount).toEqual(NUM_FAILURES)
})
