import { EventAction, INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowCustomConditional, FlowText } from '../../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from '../__mocks__/smart-intent'
// eslint-disable-next-line jest/no-mocks-import
import { trackEventMock } from '../__mocks__/track-event'
import { basicFlow } from '../helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Track conditional custom', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    trackEventMock.mockClear()
    mockSmartIntent('Other')
  })

  test('should track conditional custom', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow, trackEvent: trackEventMock },
      requestArgs: {
        input: { data: 'stringVariable', type: INPUT.TEXT },
        extraData: { bookingType: 'tourist' },
      },
    })

    expect(contents[0]).toBeInstanceOf(FlowCustomConditional)
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
      EventAction.ConditionalCustom,
      {
        conditionalVariable: 'tourist',
        flowId: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
        flowName: 'Conditionals',
        flowNodeContentId: 'BOOKING_TYPE_CONDITIONAL',
        flowNodeId: '70f5a184-4949-45a0-8651-d0c90dee32f1',
        flowThreadId: 'testFlowThreadId',
        flowNodeIsMeaningful: false,
        variableFormat: 'string',
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
