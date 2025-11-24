import { EventAction, INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowGoToFlow, FlowText } from '../../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { trackEventMock } from '../__mocks__/track-event'
import { goToFlowFlow } from '../helpers/flows/go-to-flow'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Track redirect flow', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    trackEventMock.mockClear()
  })

  test('should track redirect flow', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: goToFlowFlow, trackEvent: trackEventMock },
      requestArgs: {
        input: { data: 'hola', type: INPUT.TEXT },
        isFirstInteraction: true,
      },
    })

    console.log('contents', contents)
    expect(contents[0]).toBeInstanceOf(FlowText)
    expect(contents[1]).toBeInstanceOf(FlowGoToFlow)
    expect(contents[2]).toBeInstanceOf(FlowText)

    expect((contents[0] as FlowText).text).toEqual('Welcome')
    expect((contents[2] as FlowText).text).toEqual(
      'This message is in the second flow.'
    )

    expect(trackEventMock).toHaveBeenCalledTimes(3)
    expect(trackEventMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      EventAction.RedirectFlow,
      {
        flowId: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
        flowName: 'Main',
        flowNodeContentId: 'Go to flow',
        flowNodeId: '019aa152-d310-769f-be54-318e68352bcb',
        flowTargetId: '019aa153-cc65-716a-88e5-fc0bc43d9f1e',
        flowTargetName: 'Second flow',
        flowNodeIsMeaningful: false,
        flowThreadId: expect.anything(),
      }
    )
  })
})
