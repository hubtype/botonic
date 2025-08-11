import { EventAction, INPUT } from '@botonic/core'

import { AiAgentInferenceResponse, ProcessEnvNodeEnvs } from '../../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockAiAgentResponse } from '../__mocks__/ai-agent'
// eslint-disable-next-line jest/no-mocks-import
import { trackEventMock } from '../__mocks__/track-event'
import { aiAgentTestFlow } from '../helpers/flows/ai-agent'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Check tracked events when a contents are displayed', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    trackEventMock.mockClear()
  })

  test('Track ai agent event with response, after executing a tool', async () => {
    const userInput = 'I want to cancel my flight'
    const mockResponse: Partial<AiAgentInferenceResponse> = {
      messages: [
        {
          type: 'text',
          content: {
            text: 'Ai agent response',
          },
        },
      ],
      toolsExecuted: ['tool1'],
    }

    await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: aiAgentTestFlow,
        trackEvent: trackEventMock,
        getAiAgentResponse: mockAiAgentResponse(mockResponse),
      },
      requestArgs: {
        input: {
          data: userInput,
          type: INPUT.TEXT,
        },
      },
    })

    expect(trackEventMock).toHaveBeenCalledTimes(1)
    expect(trackEventMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      EventAction.AiAgent,
      {
        flowId: '0a2b5ce4-9cbe-518c-b70c-17544eea0365',
        flowName: 'AI Agents',
        flowNodeContentId: '',
        flowNodeId: '0196f202-a5ea-713e-a3f9-287cf8f0303a',
        flowNodeIsMeaningful: true,
        flowThreadId: 'testFlowThreadId',
        toolsExecuted: ['tool1'],
        inputGuardrailTriggered: [],
        outputGuardrailTriggered: [],
        exit: false,
        error: false,
        messageId: 'testMessageId',
      }
    )
  })
})
