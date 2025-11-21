import { EventAction, INPUT, PROVIDER } from '@botonic/core'
import { describe, test } from '@jest/globals'

import {
  FlowHandoff,
  FlowQueueStatusConditional,
  FlowText,
} from '../../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockQueueAvailability } from '../__mocks__/conditional-queue'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from '../__mocks__/smart-intent'
// eslint-disable-next-line jest/no-mocks-import
import { trackEventMock } from '../__mocks__/track-event'
import { basicFlow } from '../helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Track conditional queue status', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    trackEventMock.mockClear()
    mockQueueAvailability({ isOpen: true, name: 'General' })
    mockSmartIntent('Other')
  })

  test('should track conditional queue status', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow, trackEvent: trackEventMock },
      requestArgs: {
        input: { data: 'agent', type: INPUT.TEXT },
        provider: PROVIDER.WEBCHAT,
      },
    })

    expect(contents[0]).toBeInstanceOf(FlowQueueStatusConditional)
    expect(contents[1]).toBeInstanceOf(FlowText)
    expect(contents[2]).toBeInstanceOf(FlowHandoff)

    expect(trackEventMock).toHaveBeenCalledTimes(3)
    expect(trackEventMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      EventAction.Keyword,
      expect.anything()
    )
    expect(trackEventMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      EventAction.ConditionalQueueStatus,
      {
        flowId: '7c284240-5b87-4d3e-8de8-fa4934d07dd9',
        flowName: 'Handoff',
        flowNodeContentId: 'QUEUE-STATUS_48',
        flowNodeId: '3b363ae7-c7e5-4e6a-9df0-333cb2667637',
        flowThreadId: 'testFlowThreadId',
        isAvailableAgent: false,
        isQueueOpen: true,
        queueId: 'e7a2304d-f73c-409d-b272-239a9b8a9e0e',
        queueName: 'General',
      }
    )
    expect(trackEventMock).toHaveBeenNthCalledWith(
      3,
      expect.anything(),
      EventAction.FlowNode,
      expect.anything()
    )
  })
})
