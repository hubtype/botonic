import {
  EventAction,
  INPUT,
  type InferenceResponse,
  PROVIDER,
} from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowGoToFlow, FlowText } from '../../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockAiAgentResponse } from '../__mocks__/ai-agent'
// eslint-disable-next-line jest/no-mocks-import
import { trackEventMock } from '../__mocks__/track-event'
import {
  aiAgentGoToFlowTestFlow,
  GO_TO_AI_AGENTS_NODE_ID,
} from '../helpers/flows/ai-agent'
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

  test('should track redirect flow before resolving AI Agents go-to-flow payloads', async () => {
    const mockResponse: Partial<InferenceResponse> = {
      messages: [
        {
          type: 'text',
          content: {
            text: 'AI agent response',
          },
        },
      ],
    }

    await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: aiAgentGoToFlowTestFlow,
        trackEvent: trackEventMock,
        getAiAgentResponse: mockAiAgentResponse(mockResponse),
      },
      requestArgs: {
        input: {
          type: INPUT.POSTBACK,
          payload: GO_TO_AI_AGENTS_NODE_ID,
          referral: 'What is the weather like?',
        },
        provider: PROVIDER.WHATSAPP,
      },
    })

    expect(trackEventMock).toHaveBeenCalledTimes(2)
    expect(trackEventMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      EventAction.RedirectFlow,
      {
        flowId: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
        flowName: 'Main',
        flowNodeContentId: 'go-to-ai-agents',
        flowNodeId: GO_TO_AI_AGENTS_NODE_ID,
        flowTargetId: '0a2b5ce4-9cbe-518c-b70c-17544eea0365',
        flowTargetName: 'AI Agents',
        flowNodeIsMeaningful: false,
        flowThreadId: 'testFlowThreadId',
      }
    )
    expect(trackEventMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      EventAction.AiAgent,
      expect.objectContaining({
        flowId: '0a2b5ce4-9cbe-518c-b70c-17544eea0365',
        flowName: 'AI Agents',
        flowNodeContentId: 'Weather Agent',
        flowNodeIsMeaningful: true,
        inputMessageId: 'testMessageId',
      })
    )
  })
})
