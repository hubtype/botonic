import { testContentful } from './contentful.helper';

const TEST_DATE_RANGE_HUBTYPE_ID = '46taK0TceR2OZ8issCMhB7';

test('TEST: contentful dateRange', async () => {
  const dateRange = await testContentful().dateRange(
    TEST_DATE_RANGE_HUBTYPE_ID
  );

  expect(dateRange.name).toEqual('Test DateRange name');
  expect(dateRange.from).toEqual(new Date(2019, 4, 26, 20, 30));
  expect(dateRange.to).toEqual(new Date(2019, 8, 1));
});
