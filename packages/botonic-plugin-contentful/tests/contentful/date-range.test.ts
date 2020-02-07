import { testContentful } from './contentful.helper'

const TEST_DATE_RANGE_HUBTYPE_ID = '46taK0TceR2OZ8issCMhB7'

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

test('TEST: contentful dateRange', async () => {
  const dateRange = await testContentful().dateRange(TEST_DATE_RANGE_HUBTYPE_ID)

  expect(dateRange.common.name).toEqual('Test DateRange name')
  expect(dateRange.dateRange.from).toEqual(europeDate(2019, 4, 26, 20, 30))
  expect(dateRange.dateRange.to).toEqual(europeDate(2019, 8, 1))
})