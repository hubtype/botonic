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
  const cms = await testContentful({
    spaceId: '5wh7etpd1y84',
    environment: 'phase5.1-whatsapp',
    accessToken:
      '655008dda10b1c09948e7ce3688cdbea60f324734622c850e4905524cd1cafa7',
  })
  const queue = await cms.queue('CIlCGzjbsnXU2nXUK1oCp')
  console.log(queue.schedule?.contains(new Date()))
})
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
      testSchedule()
    )
  )
})
