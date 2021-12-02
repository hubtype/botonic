//import { ContentId, ContentType } from '../../../src/cms'
import { testContext, testDirectus } from '../helpers/directus.helper'
//import { generateRandomUUID } from '../manage/helpers/utils.helper'
//import { ContentType } from '../../../src/cms'

//const HANDOFF_ID = 'a85ea811-3812-487b-a1b7-f131db670212'

test('Test: directus handoff', async () => {
  const directus = testDirectus()
  // const handoffId = generateRandomUUID()
  // const queueId = 'de92f7a2-e385-4d6f-bca5-9ae8d3db0790'
  // await directus.createContent(new ContentId(ContentType.HANDOFF, handoffId))
  // await directus.updateHandoffFields(testContext(), handoffId, {
  //   name: 'handoffff3',
  //   handoffMessage: 'handofffff SII',
  //   handoffFailMessage: 'handoff NOOOO',
  //   queue: queueId,
  //   shadowing: true,
  //   onFinish: new ContentId(
  //     ContentType.CAROUSEL,
  //     'd7556125-e640-4ba9-816e-9f623b495886'
  //   ),
  // })
  // const handoff = await directus.handoff(handoffId, testContext())
  // const handoffs = await directus.topContents(
  //   ContentType.HANDOFF,
  //   testContext()
  // )
  // console.log(handoff)
  // console.log(handoffs)
  const handoffId = '8b507395-b5b2-4c76-a721-5b67d0bed730'
  const handoff = await directus.handoff(handoffId, testContext())
  console.log({handoff})
})
