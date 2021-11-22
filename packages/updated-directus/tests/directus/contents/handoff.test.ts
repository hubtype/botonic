import { testContext, testDirectus } from '../helpers/directus.helper'
//import { ContentType } from '../../../src/cms'

const HANDOFF_ID = 'a85ea811-3812-487b-a1b7-f131db670212'

test('Test: directus handoff', async () => {
  const directus = testDirectus()
  const handoff = await directus.handoff(HANDOFF_ID, testContext())
  //const handoffs = await directus.topContents(ContentType.HANDOFF, testContext())
  console.log(handoff)
  //console.log(handoffs)
})
