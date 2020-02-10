import {
  DaySchedule,
  HourAndMinute,
  Schedule,
  ScheduleAlwaysOn,
  TimeRange,
  WeekDay,
} from '../../src/time/schedule'
import momentTz from 'moment-timezone'

const MARCH = 2
const APRIL = 3
const NOVEMBER = 10

test('TEST ScheduleAlwaysOn', () => {
  const sut = new ScheduleAlwaysOn()
  expect(sut.contains(new Date())).toEqual(true)
})

function europeDate(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0
): Date {
  const date = new Date(Date.UTC(year, month, day, hour, minute, 0))

  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tzDate = new Date(
    date.toLocaleString('en-US', { timeZone: 'Europe/Madrid' })
  )
  const offset = utcDate.getTime() - tzDate.getTime()

  date.setTime(date.getTime() + offset)

  return date
}

test.each<any>([
  // Friday winter time
  [europeDate(2019, MARCH, 29, 8, 59), false],
  [europeDate(2019, MARCH, 29, 9, 0), true],
  [europeDate(2019, MARCH, 29, 18, 59), true],
  [europeDate(2019, MARCH, 29, 19, 0), false],
  // Saturday winter time
  [europeDate(2019, MARCH, 30, 9, 59), false],
  [europeDate(2019, MARCH, 30, 10, 0), true],
  [europeDate(2019, MARCH, 30, 15, 59), true],
  [europeDate(2019, MARCH, 30, 16, 0), false],
  // Sunday (directly discarded because there's no service on Sunday)
  [europeDate(2019, MARCH, 31, rand(0, 23), rand(0, 59)), false],
  // Monday summer time
  [europeDate(2019, APRIL, 1, 8, 59), false],
  [europeDate(2019, APRIL, 1, 9, 0), true],
  [europeDate(2019, APRIL, 1, 18, 59), true],
  [europeDate(2019, APRIL, 1, 19, 0), false],
])('TEST: Schedule.contains(%s)=>%s', (date: Date, expected: boolean) => {
  const sut = new Schedule(Schedule.TZ_CET)

  for (let d = WeekDay.MONDAY; d <= WeekDay.FRIDAY; d++) {
    const timeRange = new TimeRange(
      sut.createHourAndMinute(9),
      sut.createHourAndMinute(19)
    )
    sut.addDaySchedule(d, new DaySchedule([timeRange]))
  }
  const timeRange = new TimeRange(
    sut.createHourAndMinute(10),
    sut.createHourAndMinute(16)
  )
  sut.addDaySchedule(WeekDay.SATURDAY, new DaySchedule([timeRange]))
  sut.addDaySchedule(WeekDay.SUNDAY, new DaySchedule([]))

  // act
  expect(sut.contains(date)).toEqual(expected)
})

test('TEST: HourAndMinute.compareToDate CET', () => {
  const zone = momentTz.tz.zone('Europe/Madrid')
  const time = new HourAndMinute(zone!, 13, 45)

  const date = europeDate(2019, 5, 29, 13, 46)

  expect(time.compareToDate(date)).toEqual(-1)

  date.setMinutes(45)
  expect(time.compareToDate(date)).toEqual(0)

  date.setMinutes(44)
  expect(time.compareToDate(date)).toEqual(1)
})

test('TEST: HourAndMinute.compareToDate OTHER', () => {
  const zone = momentTz.tz.zone('Europe/London')
  const time = new HourAndMinute(zone!, 12, 45)

  const date = europeDate(2019, 5, 29, 13, 46)
  expect(time.compareToDate(date)).toEqual(-1)

  date.setMinutes(45)
  expect(time.compareToDate(date)).toEqual(0)

  date.setMinutes(44)
  expect(time.compareToDate(date)).toEqual(1)
})

test('TEST: timeInThisTimezone ', () => {
  const sut = new Schedule('Europe/London')

  const date = europeDate(2019, 5, 29, 0, 51)
  expect(sut.timeInThisTimezone('es', date)).toEqual('23:51:00')
})

test('TEST: ends at midnight', () => {
  const sut = new Schedule('Europe/Madrid')
  sut.addDaySchedule(
    WeekDay.WEDNESDAY,
    new DaySchedule([
      new TimeRange(sut.createHourAndMinute(10), sut.createHourAndMinute(0)),
    ])
  )
  const date9h = europeDate(2019, NOVEMBER, 27, 9)
  expect(sut.contains(date9h)).toBeFalsy()
  const date23h = europeDate(2019, NOVEMBER, 27, 23, 59)
  expect(sut.contains(date23h)).toBeTruthy()
})

test('TEST: addException', () => {
  const sut = new Schedule('Europe/Madrid')
  sut.addDaySchedule(
    WeekDay.FRIDAY,
    new DaySchedule([
      new TimeRange(sut.createHourAndMinute(10), sut.createHourAndMinute(12)),
    ])
  )

  const date10h = europeDate(2019, MARCH, 29, 10)
  expect(sut.contains(date10h)).toBeTruthy()
  const date12h = europeDate(2019, MARCH, 29, 12)
  expect(sut.contains(date12h)).toBeFalsy()

  sut.addException(
    date10h,
    new DaySchedule([
      new TimeRange(sut.createHourAndMinute(11), sut.createHourAndMinute(13)),
    ])
  )
  expect(sut.contains(date10h)).toBeFalsy()
  expect(sut.contains(date12h)).toBeTruthy()
})

test('TEST: addException start day', () => {
  const sut = new Schedule('Europe/Madrid')
  sut.addDaySchedule(
    WeekDay.FRIDAY,
    new DaySchedule([
      new TimeRange(sut.createHourAndMinute(10), sut.createHourAndMinute(12)),
    ])
  )

  sut.addException(
    europeDate(2019, MARCH, 29),
    new DaySchedule([
      new TimeRange(sut.createHourAndMinute(0), sut.createHourAndMinute(1)),
      new TimeRange(sut.createHourAndMinute(11), sut.createHourAndMinute(13)),
    ])
  )
  expect(sut.contains(europeDate(2019, MARCH, 28, 23, 59))).toBeFalsy()
  expect(sut.contains(europeDate(2019, MARCH, 29, 0, 0))).toBeTruthy()
  expect(sut.contains(europeDate(2019, MARCH, 29, 0, 15))).toBeTruthy()
  expect(sut.contains(europeDate(2019, MARCH, 29, 1, 0))).toBeFalsy()
  expect(sut.contains(europeDate(2019, MARCH, 29, 1, 1))).toBeFalsy()
  expect(sut.contains(europeDate(2019, MARCH, 29, 23, 59))).toBeFalsy()
  expect(sut.contains(europeDate(2019, MARCH, 30, 0, 0))).toBeFalsy()
})

test('TEST: addException end day', () => {
  const sut = new Schedule('Europe/Madrid')
  sut.addDaySchedule(
    WeekDay.FRIDAY,
    new DaySchedule([
      new TimeRange(sut.createHourAndMinute(10), sut.createHourAndMinute(12)),
    ])
  )

  sut.addException(
    europeDate(2019, MARCH, 29, 1), //Friday //BUG this do not work when hour is 0 executed on github actions
    new DaySchedule([
      new TimeRange(
        sut.createHourAndMinute(23),
        sut.createHourAndMinute(23, 30)
      ),
    ])
  )

  expect(sut.contains(europeDate(2019, MARCH, 28, 23, 15))).toBeFalsy()
  expect(sut.contains(europeDate(2019, MARCH, 29, 22, 59))).toBeFalsy()
  expect(sut.contains(europeDate(2019, MARCH, 29, 23, 0))).toBeTruthy()
  expect(sut.contains(europeDate(2019, MARCH, 29, 23, 29))).toBeTruthy()
  expect(sut.contains(europeDate(2019, MARCH, 29, 23, 30))).toBeFalsy()
  expect(sut.contains(europeDate(2019, MARCH, 30, 0, 0))).toBeFalsy()
  expect(sut.contains(europeDate(2019, MARCH, 30, 23, 15))).toBeFalsy()
})

test('TEST: time.toString ', () => {
  // tz does not affect toString
  const zone = momentTz.tz.zone('Europe/London')

  const time = new HourAndMinute(zone!, 13, 45)
  expect(time.toString()).toEqual('13:45h')
})

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}