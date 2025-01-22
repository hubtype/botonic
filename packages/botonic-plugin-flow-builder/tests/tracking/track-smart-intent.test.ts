import { INPUT } from '@botonic/core'

import { ProcessEnvNodeEnvs } from '../../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent, trackEventMock } from '../__mocks__'
import { basicFlow } from '../helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Check tracked events when a contents are displayed after match with smart intent', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    trackEventMock.mockClear()
    mockSmartIntent('add a bag')
  })

  test('Track nlu_intent_smart', async () => {
    await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: basicFlow,
        trackEvent: trackEventMock,
      },
      requestArgs: {
        input: { data: 'How can I add a bag to my booking?', type: INPUT.TEXT },
      },
    })

    expect(trackEventMock).toHaveBeenCalledTimes(2)
    expect(trackEventMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      'nlu_intent_smart',
      {
        nluIntentSmartTitle: 'add a bag',
        nluIntentSmartNumUsed: 2,
        nluIntentSmartMessageId: expect.anything(),
        userInput: 'How can I add a bag to my booking?',
        flowId: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
        flowNodeId: 'a962b2e5-9424-4fe5-81bd-8cb398b59875',
        flowThreadId: 'testFlowThreadId',
      }
    )
    expect(trackEventMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      'flow_node',
      {
        flowThreadId: expect.anything(),
        flowId: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
        flowName: 'Main',
        flowNodeId: 'a91c0bca-c213-4693-b3bd-f091fcbf445c',
        flowNodeContentId: 'ADD_BAG_MSG',
        flowNodeIsMeaningful: false,
      }
    )
  })
})
