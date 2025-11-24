import { EventAction, INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import {
  FlowCountryConditional,
  FlowText,
} from '../../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from '../__mocks__/smart-intent'
// eslint-disable-next-line jest/no-mocks-import
import { trackEventMock } from '../__mocks__/track-event'
import { basicFlow } from '../helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Track conditional country', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    trackEventMock.mockClear()
    mockSmartIntent('Other')
  })

  test('should track conditional country', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow, trackEvent: trackEventMock },
      requestArgs: {
        input: { data: 'countryConditional', type: INPUT.TEXT },
        user: {
          locale: 'en',
          country: 'ES',
          systemLocale: 'en',
        },
      },
    })

    expect(contents[0]).toBeInstanceOf(FlowCountryConditional)
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
      EventAction.ConditionalCountry,
      {
        country: 'ES',
        flowId: 'e9ccb6ea-99e2-4bc4-9376-4508aafb6c24',
        flowName: 'Conditionals',
        flowNodeContentId: 'COUNTRY_CONDITIONAL',
        flowNodeId: 'c16d06b0-7b05-4771-94fe-065357bd6407',
        flowThreadId: 'testFlowThreadId',
        flowNodeIsMeaningful: false,
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
