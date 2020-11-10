import 'jest-extended'

import { ContentType } from '../../src/cms'
import { testContentful, testContext } from './contentful.helper'
import { TEST_POST_FAQ1_ID } from './contents/text.test'

test('TEST: contentful contentsWithKeywords', async () => {
  const results = await testContentful().contentsWithKeywords(
    testContext([{ locale: 'en' }, {}, undefined])
  )

  const queues = results.filter(r => r.contentId.model === ContentType.QUEUE)
  const searchResults = results.filter(
    r => r.contentId.model !== ContentType.QUEUE
  )
  expect(queues).toHaveLength(2)
  const keywordsByPrio: { [priority: number]: string[] } = {}
  for (const queue of queues) {
    expect(queue.common.name).toEqual('TEST_QUEUE')
    expect(queue.common.shortText).toEqual('Queue Short Text')
    keywordsByPrio[queue.priority] = queue.common.keywords
  }
  expect(keywordsByPrio[10]).toEqual(['low1', 'low2'])
  expect(keywordsByPrio[99]).toEqual(['high1', 'high2'])

  expect(searchResults.length).toBeGreaterThanOrEqual(17)

  const postFaq1 = searchResults.find(
    result => result.contentId.id == TEST_POST_FAQ1_ID
  )
  expect(postFaq1!.common.name).toEqual('POST_FAQ1')
  expect(postFaq1!.common.shortText).toEqual('Find my command')
  expect(postFaq1!.priority).toEqual(100)
  expect(postFaq1!.common.keywords).toIncludeSameMembers([
    "can't find my order",
    'where is my order',
  ])
}, 10000)
