import { CommonFields, ContentType, SPANISH } from '../../src'
import { Measure, Profiler } from '../../src/util/profiler'
import { testContentful } from './contentful.helper'
import { TEST_POST_FAQ1_ID } from './contents/text.test'

test.skip('INTEGRATION TEST: performance', async () => {
  Profiler.enable()
  const contentful = testContentful({
    disableCache: true,
    spaceId: '5wh7etpd1y84',
    environment: 'master',
    accessToken:
      '655008dda10b1c09948e7ce3688cdbea60f324734622c850e4905524cd1cafa7',
  })
  const t = await contentful.text(TEST_POST_FAQ1_ID, { locale: SPANISH })
  console.log(t.text)

  for (let i = 0; i < 1000; i++) {
    const searchM = new Measure('nothing')
    searchM.end()
  }

  const loopM = new Measure('LOOP')
  for (let i = 0; i < 300; i++) {
    const searchM = new Measure('total')
    await contentful.topContents(
      ContentType.QUEUE,
      {
        locale: 'es',
      },
      (cf: CommonFields) => cf.partitions && cf.partitions.includes('ES')
    )
    searchM.end()
  }
  loopM.end()
  console.log(Profiler.getSummaryAll())
  Profiler.disable()
}, 60000)
