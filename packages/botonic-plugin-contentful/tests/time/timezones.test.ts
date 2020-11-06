import momentTz from 'moment-timezone'
import { offsetWithTimeZone } from '../../src/time/timezones'
import { cetDate } from './time.helper'

test('TEST: offsetWithTimeZone', () => {
  const date = cetDate(2020, 1, 1, 0)

  // act
  const offset1 = offsetWithTimeZone(momentTz.tz.zone('Europe/London')!, date)
  const offset2 = offsetWithTimeZone(momentTz.tz.zone('Europe/Madrid')!, date)

  // assert
  expect(offset2 - offset1).toEqual(60 * 60 * 1000)
})
