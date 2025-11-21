import { EventAction, INPUT, PROVIDER } from '@botonic/core'
import { describe, test } from '@jest/globals'

import {
  FlowChannelConditional,
  FlowText,
} from '../../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from '../__mocks__/smart-intent'
// eslint-disable-next-line jest/no-mocks-import
import { trackEventMock } from '../__mocks__/track-event'
import { basicFlow } from '../helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Track conditional channel', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    trackEventMock.mockClear()
    mockSmartIntent('Other')
  })

  test('should track conditional channel', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow, trackEvent: trackEventMock },
      requestArgs: {
        input: { data: 'channelConditional', type: INPUT.TEXT },
        provider: PROVIDER.WEBCHAT,
      },
    })

    expect(contents[0]).toBeInstanceOf(FlowChannelConditional)
    expect(contents[1]).toBeInstanceOf(FlowText)

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
      EventAction.ConditionalChannel,
      {
        channel: 'default',
        flowId: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
        flowName: 'Conditionals',
        flowNodeContentId: 'CHANNEL_CONDITIONAL',
        flowNodeId: 'ddaf7bf5-0677-4a59-89e0-c3859a6fb7ce',
        flowThreadId: 'testFlowThreadId',
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
