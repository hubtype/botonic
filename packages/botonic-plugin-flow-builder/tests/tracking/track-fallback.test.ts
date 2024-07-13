import { INPUT } from '@botonic/core'

import { ProcessEnvNodeEnvs } from '../../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent, trackEventMock } from '../__mocks__'
import { basicFlow } from '../helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Check tracked events when a contents are displayed', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    trackEventMock.mockClear()
    mockSmartIntent('Other')
  })
  test('Track fallback and flow_node events', async () => {
    const userInput = 'I want to cancel my flight'

    await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: basicFlow,
        trackEvent: trackEventMock,
      },
      requestArgs: {
        input: { data: userInput, type: INPUT.TEXT },
      },
    })
    expect(trackEventMock).toHaveBeenCalledTimes(2)
    expect(trackEventMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      'fallback',
      {
        userInput: userInput,
        fallbackOut: 1,
        fallbackMessageId: expect.anything(),
      }
    )
    expect(trackEventMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      'flow_node',
      {
        flowThreadId: expect.anything(),
        flowId: '03bafba6-c0fa-5449-9d42-bd98b44fe370',
        flowName: 'Fallback',
        flowNodeId: '802474a3-cb77-45a9-bff5-ca5eb762eb78',
        flowNodeContentId: '1ST_FALLBACK_MSG',
        flowNodeIsMeaningful: false,
      }
    )
  })
})
