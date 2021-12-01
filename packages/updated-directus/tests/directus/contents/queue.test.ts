import { testContext, testDirectus } from '../helpers/directus.helper'
//import { ContentType } from '../../../src/cms'

const QUEUE_ID = 'a935465c-af63-4c7b-bc12-d8484b33af84'

test('Test: directus queue', async () => {
  const directus = testDirectus()
  const queue = await directus.queue(QUEUE_ID, testContext())
  //const queues = await directus.topContents(ContentType.QUEUE, testContext())
  console.log(queue)
  directus.updateQueueFields(testContext(), QUEUE_ID, {
    queue:'asdfg'
  })
  //console.log(queues)
})
