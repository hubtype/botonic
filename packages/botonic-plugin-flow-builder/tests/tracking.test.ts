import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { ProcessEnvNodeEnvs } from './../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { trackEventMock } from './__mocks__/track-event'
import { basicFlow } from './helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

describe('Check the events tracked when a contents are displayed', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test('Track nlu_keyword and flow_node events', async () => {
    await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: basicFlow,
        trackEvent: trackEventMock,
      },
      requestArgs: {
        input: { data: 'flowText', type: INPUT.TEXT },
      },
    })

    expect(trackEventMock).toHaveBeenCalledTimes(2)
    expect(trackEventMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      'nlu_keyword',
      {
        nluKeywordId: '8ec6a479-dca5-4623-8bab-41fa49c9d6e8',
        nluKeywordName: 'flowText',
        nluKeywordIsRegex: false,
        nluKeywordMessageId: undefined,
        userInput: 'flowText',
      }
    )
    expect(trackEventMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      'flow_node',
      {
        flowThreadId: expect.anything(),
        flowId: '43a736f8-4837-4fbb-a661-021291749b4f',
        flowName: 'Different messages',
        flowNodeId: '7afe0981-e9d3-4e3e-b9d1-5d362d3873b3',
        flowNodeContentId: 'BUTTONS_REPLACEMENT_VARIABLE',
        flowNodeIsMeaningful: false,
      }
    )
  })
})
