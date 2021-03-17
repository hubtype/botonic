import { DaySchedule, Schedule, TimeRange, WeekDay } from '../../../src/time'
import { testContentful } from '../contentful.helper'

test('TEST: contentful schedule', async () => {
  const sut = testContentful()

  // act
  const schedule = await sut.schedule('71twiV4wcaFwhK6tSYuIKy')
  // assert
  expect(schedule.schedule).toEqual(testSchedule())
  expect(schedule.common.name).toEqual('SUPPORT_SCHEDULE1')
  expect(schedule.common.customFields).toEqual({
    customFieldText: 'This is text!!!',
  })
})

export function testSchedule(): Schedule {
  const expected = new Schedule('Europe/Madrid')
  for (let d = WeekDay.MONDAY; d <= WeekDay.FRIDAY; d++) {
    const timeRange = new TimeRange(
      expected.createHourAndMinute(9),
      expected.createHourAndMinute(19)
    )
    expected.addDaySchedule(d, new DaySchedule([timeRange]))
  }
  const timeRange = new TimeRange(
    expected.createHourAndMinute(10),
    expected.createHourAndMinute(16)
  )
  expected.addDaySchedule(WeekDay.SATURDAY, new DaySchedule([timeRange]))
  expected.addException(new Date(2019, 5, 24), new DaySchedule([]))
  expected.addException(
    new Date(2019, 6, 7),
    new DaySchedule([
      new TimeRange(
        expected.createHourAndMinute(10),
        expected.createHourAndMinute(16)
      ),
      new TimeRange(
        expected.createHourAndMinute(18, 30),
        expected.createHourAndMinute(22, 45)
      ),
    ])
  )
  return expected
}
