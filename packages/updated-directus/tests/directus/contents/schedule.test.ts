import { testContext, testDirectus } from '../helpers/directus.helper'

const SCHEDULE_ID = '1fd5e986-356a-4dd1-bfc9-f9b1bb262595'

test('Test: directus schedule', async () => {
  const directus = testDirectus()
  const schedule = await directus.schedule(SCHEDULE_ID, testContext())
  console.log(schedule)
})
