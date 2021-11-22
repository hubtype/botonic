import { testContext, testDirectus } from '../helpers/directus.helper'
//import { ContentType } from '../../../src/cms'

const QUEUE_ID = '5c56b8c8-98ed-42fb-8dc1-e91f4ddb6e10'

test('Test: directus queue', async () => {
  const directus = testDirectus()
  const queue = await directus.queue(QUEUE_ID, testContext())
  //const queues = await directus.topContents(ContentType.QUEUE, testContext())
  console.log(queue)
  //console.log(queues)
})
