import { INPUT, type InferenceResponse, PROVIDER } from '@botonic/core'
import { beforeEach, describe, expect, test } from '@jest/globals'

import { EMPTY_PAYLOAD, SOURCE_INFO_SEPARATOR } from '../src/constants'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockAiAgentResponse } from './__mocks__/ai-agent'
import { aiAgentTestFlow } from './helpers/flows/ai-agent'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

describe('WhatsApp AI Agent Empty Payload Conversion', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should convert WhatsApp empty payload to text input when referral exists', async () => {
    const mockResponse: Partial<InferenceResponse> = {
      messages: [
        {
          type: 'text',
          content: {
            text: 'AI agent response to referral',
          },
        },
      ],
    }

    const { request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: aiAgentTestFlow,
        getAiAgentResponse: mockAiAgentResponse(mockResponse),
      },
      requestArgs: {
        input: {
          data: 'button_click',
          type: INPUT.POSTBACK,
          payload: `${EMPTY_PAYLOAD}${SOURCE_INFO_SEPARATOR}0`,
          referral: 'What is the weather like?',
        },
        provider: PROVIDER.WHATSAPP,
      },
    })

    // The conversion should have changed the input type and data
    expect(request.input.type).toBe(INPUT.TEXT)
    expect(request.input.data).toBe('What is the weather like?')
    expect(request.input.referral).toBe('What is the weather like?')
  })

  test('should not convert non-WhatsApp provider empty payloads', async () => {
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

    const { request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: aiAgentTestFlow,
        getAiAgentResponse: mockAiAgentResponse(mockResponse),
      },
      requestArgs: {
        input: {
          data: 'button_click',
          type: INPUT.POSTBACK,
          payload: `${EMPTY_PAYLOAD}${SOURCE_INFO_SEPARATOR}0`,
          referral: 'What is the weather like?',
        },
        provider: PROVIDER.TELEGRAM, // Non-WhatsApp provider
      },
    })

    // The conversion should NOT have changed the input
    expect(request.input.type).toBe(INPUT.POSTBACK)
    expect(request.input.data).toBe('button_click')
    expect(request.input.referral).toBe('What is the weather like?')
  })

  test('should not convert when payload does not start with EMPTY_PAYLOAD', async () => {
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

    const { request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: aiAgentTestFlow,
        getAiAgentResponse: mockAiAgentResponse(mockResponse),
      },
      requestArgs: {
        input: {
          data: 'button_click',
          type: INPUT.POSTBACK,
          payload: 'regular-payload', // Not starting with EMPTY_PAYLOAD
          referral: 'What is the weather like?',
        },
        provider: PROVIDER.WHATSAPP,
      },
    })

    // The conversion should NOT have changed the input
    expect(request.input.type).toBe(INPUT.POSTBACK)
    expect(request.input.data).toBe('button_click')
    expect(request.input.referral).toBe('What is the weather like?')
  })

  test('should not convert when referral is missing', async () => {
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

    const { request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: aiAgentTestFlow,
        getAiAgentResponse: mockAiAgentResponse(mockResponse),
      },
      requestArgs: {
        input: {
          data: 'button_click',
          type: INPUT.POSTBACK,
          payload: `${EMPTY_PAYLOAD}${SOURCE_INFO_SEPARATOR}0`,
          // referral is missing
        },
        provider: PROVIDER.WHATSAPP,
      },
    })

    // The conversion should NOT have changed the input
    expect(request.input.type).toBe(INPUT.POSTBACK)
    expect(request.input.data).toBe('button_click')
    expect(request.input.referral).toBeUndefined()
  })

  test('should handle payload with different button indices', async () => {
    const mockResponse: Partial<InferenceResponse> = {
      messages: [
        {
          type: 'text',
          content: {
            text: 'AI agent response to button 2',
          },
        },
      ],
    }

    const { request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: aiAgentTestFlow,
        getAiAgentResponse: mockAiAgentResponse(mockResponse),
      },
      requestArgs: {
        input: {
          data: 'button_click',
          type: INPUT.POSTBACK,
          payload: `${EMPTY_PAYLOAD}${SOURCE_INFO_SEPARATOR}2`, // Button index 2
          referral: 'Tell me about product 2',
        },
        provider: PROVIDER.WHATSAPP,
      },
    })

    // The conversion should have changed the input type and data
    expect(request.input.type).toBe(INPUT.TEXT)
    expect(request.input.data).toBe('Tell me about product 2')
    expect(request.input.referral).toBe('Tell me about product 2')
  })

  test('should handle null payload gracefully', async () => {
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

    const { request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: aiAgentTestFlow,
        getAiAgentResponse: mockAiAgentResponse(mockResponse),
      },
      requestArgs: {
        input: {
          data: 'button_click',
          type: INPUT.POSTBACK,
          // payload is undefined
          referral: 'What is the weather like?',
        },
        provider: PROVIDER.WHATSAPP,
      },
    })

    // The conversion should NOT have changed the input
    expect(request.input.type).toBe(INPUT.POSTBACK)
    expect(request.input.data).toBe('button_click')
    expect(request.input.referral).toBe('What is the weather like?')
  })
})
