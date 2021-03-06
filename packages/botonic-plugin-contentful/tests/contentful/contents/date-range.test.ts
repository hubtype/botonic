import { cetDate } from '../../time/time.helper'
import { testContentful } from '../contentful.helper'

const TEST_DATE_RANGE_HUBTYPE_ID = '46taK0TceR2OZ8issCMhB7'

test('TEST: contentful dateRange', async () => {
  const dateRange = await testContentful().dateRange(TEST_DATE_RANGE_HUBTYPE_ID)

  expect(dateRange.common.name).toEqual('Test DateRange name')
  expect(dateRange.dateRange.from).toEqual(cetDate(2019, 4, 26, 20, 30))
  expect(dateRange.dateRange.to).toEqual(cetDate(2019, 8, 1))
  expect(dateRange.common.customFields).toEqual({
    customFieldText: "Hi, I'm a text!",
    customFieldNumber: 555,
    customFieldBoolean: true,
  })
})
