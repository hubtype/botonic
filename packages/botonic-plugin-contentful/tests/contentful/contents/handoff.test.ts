import {
  ContentCallback,
  ContentType,
  HandoffAgentId,
  HandoffQueue,
  SPANISH,
} from '../../../src'
import { testContentful, testContext } from '../contentful.helper'

const TEST_HANDOFF_AGENT_ID_MAIN_ID = '6I5SudoItjGmxrVZPr0qeG'
const TEST_HANDOFF_QUEUE_MAIN_ID = '6A7D4ssRYuLufjvl1pnOzV'
const TEST_QUEUE_ID = '62ILnVxLHOEp7aVvPMpCO8'

describe('Contentful Handoff', () => {
  test('TEST: contentful handoff with queue as destination', async () => {
    const sut = testContentful()

    // act
    const handoff = await sut.handoff(
      TEST_HANDOFF_QUEUE_MAIN_ID,
      testContext([{ locale: SPANISH }])
    )

    // assert
    const queue = await testContentful().queue(TEST_QUEUE_ID, testContext())
    expect(handoff.text).toEqual('En breve un agente le atenderá')
    expect(handoff.common.name).toEqual('HANDOFF QUEUE')
    expect(handoff.common.shortText).toEqual('Agent Handoff')
    expect(handoff.destination).toEqual(new HandoffQueue(queue))
    expect(handoff.onFinish).toEqual(
      new ContentCallback(ContentType.TEXT, 'C39lEROUgJl9hHSXKOEXS')
    )
    expect(handoff.shadowing).toEqual(true)
    expect(handoff.common.customFields).toEqual({
      customFieldText: 'custom Text',
    })
  })

  test('TEST: contentful handoff with AgentId as destination', async () => {
    const sut = testContentful()

    // act
    const handoff = await sut.handoff(
      TEST_HANDOFF_AGENT_ID_MAIN_ID,
      testContext([{ locale: SPANISH }])
    )

    // assert
    expect(handoff.text).toEqual('En breve un agente le atenderá')
    expect(handoff.common.name).toEqual('HANDOFF AGENT_ID')
    expect(handoff.common.shortText).toEqual('Agent Handoff')
    expect(handoff.destination).toEqual(new HandoffAgentId('agent id'))
    expect(handoff.onFinish).toEqual(
      new ContentCallback(ContentType.TEXT, 'C39lEROUgJl9hHSXKOEXS')
    )
    expect(handoff.shadowing).toEqual(false)
    expect(handoff.common.customFields).toEqual({
      customFieldText: 'custom Text',
    })
  })
})
