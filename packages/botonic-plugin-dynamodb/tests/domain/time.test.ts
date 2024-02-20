import Time from '../../src/domain/time'
import { ExtendedMatchers, init } from '../helpers/jest'

test('TEST: now() by default no ms', () => {
  expect(Time.now().getMilliseconds()).toBe(0)
})

test('TEST: now() similar to Date()', () => {
  // let diff =
  init()
  const time = Time.now().getTime() + 1000
  // eslint-disable-next-line jest/valid-expect
  ;(expect(time) as unknown as ExtendedMatchers<any, any>).toBeAround(
    new Date().getTime(),
    1000
  )
})
