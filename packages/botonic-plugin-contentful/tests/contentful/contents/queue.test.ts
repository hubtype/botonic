import {
  CommonFields,
  Queue,
  SearchableBy,
  SearchableByKeywords,
} from '../../../src/cms'
import { testContentful, testContext } from '../contentful.helper'
import { testSchedule } from './schedule.test'

const TEST_QUEUE_ID = '62ILnVxLHOEp7aVvPMpCO8'

test('TEST: contentful Queue', async () => {
  const queue = await testContentful().queue(TEST_QUEUE_ID, testContext())

  const searchableBy = new SearchableBy([
    new SearchableByKeywords('HIGH_PRIO', ['high1', 'high2'], 99),
    new SearchableByKeywords('LOW_PRIO', ['low1', 'low2'], 10),
  ])
  expect(queue).toEqual(
    new Queue(
      new CommonFields(TEST_QUEUE_ID, 'TEST_QUEUE', {
        shortText: 'Queue Short Text',
        searchableBy,
      }),
      'queueName',
      testSchedule(),
      'handoffMessage'
    )
  )
})
