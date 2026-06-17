import type { DebugLogger } from '../src/debug-logger'
import type { LLMConfig } from '../src/llm-config'
import type { AgenticInputMessage, AIAgent, Context } from '../src/types'

const mockTrackLlmRuns = jest.fn().mockResolvedValue(undefined)
const mockRunnerRunImpl = jest.fn()
let capturedRunnerConfig: any = null
var mockIsProd = false

jest.mock('../src/services/hubtype-api-client', () => ({
  HubtypeApiClient: jest.fn().mockImplementation(() => ({
    trackLlmRuns: mockTrackLlmRuns,
  })),
}))

jest.mock('../src/constants', () => ({
  LLM_PROVIDER: 'azure',
  LLM_PROVIDERS: { OPENAI: 'openai', AZURE: 'azure', LITELLM: 'litellm' },
  LLM_OPENAI_MODEL: 'gpt-4.1-mini',
  LLM_AZURE_API_VERSION: '2025-01-01-preview',
  get isProd() {
    return mockIsProd
  },
}))

jest.mock('@openai/agents', () => {
  class MockInputGuardrailTripwireTriggered extends Error {
    result: any
    constructor(result: any) {
      super('InputGuardrailTripwireTriggered')
      this.result = result
    }
  }

  class MockRunContext {
    context: unknown
    constructor(context: unknown) {
      this.context = context
    }
  }

  const MockRunner = jest.fn().mockImplementation((config: any) => {
    capturedRunnerConfig = config
    return {
      run: mockRunnerRunImpl,
    }
  })

  return {
    Runner: MockRunner,
    RunContext: MockRunContext,
    InputGuardrailTripwireTriggered: MockInputGuardrailTripwireTriggered,
  }
})

import { RouterRunner } from '../src/runners/router-runner'

const mockLogger: DebugLogger = {
  logInitialConfig: jest.fn(),
  logAgentDebugInfo: jest.fn(),
  logModelSettings: jest.fn(),
  logRunnerStart: jest.fn(),
  logRunResult: jest.fn(),
  logGuardrailTriggered: jest.fn(),
  logRunnerError: jest.fn(),
  logToolExecution: jest.fn(),
}

const mockLlmConfig = {
  modelName: 'gpt-4.1-mini',
  modelSettings: { temperature: 0 },
  modelProvider: {},
  getApiVersion: jest.fn().mockReturnValue('test-api-version'),
  getProviderName: jest.fn().mockReturnValue('azure'),
} as unknown as LLMConfig

const mockAgent = {
  name: 'RouterAgent',
  tools: [],
  modelSettings: { temperature: 0 },
  getSystemPrompt: jest.fn().mockResolvedValue('test system prompt'),
} as unknown as AIAgent<any, any>

const mockContext = {
  authToken: 'test-token',
  knowledgeUsed: {
    query: '',
    sourceIds: [],
    chunksIds: [],
    chunkTexts: [],
  },
  request: {
    session: {
      bot: { id: 'test-bot-id' },
      is_test_integration: false,
    },
  },
} as unknown as Context

const sampleMessages: AgenticInputMessage[] = [
  { role: 'user', content: 'Hello' } as any,
]

function makeRawResponse(
  inputTokens: number,
  outputTokens: number,
  model?: string
) {
  return {
    usage: { inputTokens, outputTokens },
    providerData: model ? { model } : {},
  }
}

describe('RouterAgentRunner', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    capturedRunnerConfig = null
    mockIsProd = false
  })

  it('should create Runner with execution settings only', async () => {
    mockRunnerRunImpl.mockResolvedValueOnce({
      finalOutput: {
        messages: [{ type: 'text', content: { text: 'Hi' } }],
      },
      state: { _currentAgent: { name: 'RouterAgent' } },
    })

    const runner = new RouterRunner(
      mockAgent,
      mockLlmConfig,
      'test-inference-id',
      mockLogger
    )

    const result = await runner.run(sampleMessages, mockContext)

    expect(capturedRunnerConfig).toEqual({ tracingDisabled: true })
    expect(capturedRunnerConfig).not.toHaveProperty('modelSettings')
    expect(capturedRunnerConfig).not.toHaveProperty('modelProvider')
    expect(result.messages).toEqual([{ type: 'text', content: { text: 'Hi' } }])
    expect(result.exit).toBe(false)
  })

  it('should return all direct router messages when there is no exit message', async () => {
    const messages = [
      { type: 'text', content: { text: 'Hi' } },
      { type: 'text', content: { text: 'How can I help?' } },
    ]
    mockRunnerRunImpl.mockResolvedValueOnce({
      finalOutput: { messages },
      state: { _currentAgent: { name: 'RouterAgent' } },
    })

    const runner = new RouterRunner(
      mockAgent,
      mockLlmConfig,
      'test-inference-id',
      mockLogger
    )

    const result = await runner.run(sampleMessages, mockContext)

    expect(result.messages).toEqual(messages)
    expect(result.exit).toBe(false)
    expect(result.memoryLength).toBe(sampleMessages.length)
    expect(result.toolsExecuted).toEqual([])
    expect(result.error).toBe(false)
  })

  it('should exit when finalOutput is missing', async () => {
    mockRunnerRunImpl.mockResolvedValueOnce({
      state: { _currentAgent: { name: 'RouterAgent' } },
    })

    const runner = new RouterRunner(
      mockAgent,
      mockLlmConfig,
      'test-inference-id',
      mockLogger
    )

    const result = await runner.run(sampleMessages, mockContext)

    expect(result.messages).toEqual([])
    expect(result.exit).toBe(true)
    expect(result.memoryLength).toBe(sampleMessages.length)
    expect(result.toolsExecuted).toEqual([])
    expect(result.error).toBe(false)
  })

  it('should exit when finalOutput has no messages', async () => {
    mockRunnerRunImpl.mockResolvedValueOnce({
      finalOutput: { messages: [] },
      state: { _currentAgent: { name: 'RouterAgent' } },
    })

    const runner = new RouterRunner(
      mockAgent,
      mockLlmConfig,
      'test-inference-id',
      mockLogger
    )

    const result = await runner.run(sampleMessages, mockContext)

    expect(result.messages).toEqual([])
    expect(result.exit).toBe(true)
    expect(result.memoryLength).toBe(sampleMessages.length)
    expect(result.toolsExecuted).toEqual([])
    expect(result.error).toBe(false)
  })

  it('should exit and drop messages when an exit message is present', async () => {
    mockRunnerRunImpl.mockResolvedValueOnce({
      finalOutput: {
        messages: [
          { type: 'text', content: { text: 'Goodbye' } },
          { type: 'exit' },
        ],
      },
      state: { _currentAgent: { name: 'RouterAgent' } },
    })

    const runner = new RouterRunner(
      mockAgent,
      mockLlmConfig,
      'test-inference-id',
      mockLogger
    )

    const result = await runner.run(sampleMessages, mockContext)

    expect(result.messages).toEqual([])
    expect(result.exit).toBe(true)
    expect(result.memoryLength).toBe(sampleMessages.length)
    expect(result.toolsExecuted).toEqual([])
    expect(result.error).toBe(false)
  })

  describe('LLM run tracking', () => {
    beforeEach(() => {
      mockIsProd = true
    })

    it('should call trackLlmRuns after a successful router run in production', async () => {
      mockRunnerRunImpl.mockResolvedValueOnce({
        finalOutput: {
          messages: [{ type: 'text', content: { text: 'Hi' } }],
        },
        rawResponses: [makeRawResponse(200, 50, 'gpt-4.1-mini-2025-04-14')],
        state: { _currentAgent: { name: 'RouterAgent' } },
      })

      const runner = new RouterRunner(
        mockAgent,
        mockLlmConfig,
        'test-inference-id',
        mockLogger
      )

      await runner.run(sampleMessages, mockContext)

      expect(mockTrackLlmRuns).toHaveBeenCalledWith(
        'test-bot-id',
        expect.objectContaining({
          llm_runs: [
            expect.objectContaining({
              inference_id: 'test-inference-id',
              is_test: false,
              deployment_name: 'gpt-4.1-mini',
              model_name: 'gpt-4.1-mini-2025-04-14',
              num_prompt_tokens: 200,
              num_completion_tokens: 50,
              temperature: 0,
            }),
          ],
        })
      )
    })

    it('should call trackLlmRuns once per rawResponse in production', async () => {
      mockRunnerRunImpl.mockResolvedValueOnce({
        finalOutput: {
          messages: [{ type: 'text', content: { text: 'Hi' } }],
        },
        rawResponses: [
          makeRawResponse(100, 20, 'gpt-4.1-mini-2025-04-14'),
          makeRawResponse(150, 30, 'gpt-4.1-mini-2025-04-14'),
        ],
        state: { _currentAgent: { name: 'RouterAgent' } },
      })

      const runner = new RouterRunner(
        mockAgent,
        mockLlmConfig,
        'test-inference-id',
        mockLogger
      )

      await runner.run(sampleMessages, mockContext)

      const payload = mockTrackLlmRuns.mock.calls[0][1]
      expect(payload.llm_runs).toHaveLength(2)
      expect(payload.llm_runs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            num_prompt_tokens: 100,
            num_completion_tokens: 20,
          }),
          expect.objectContaining({
            num_prompt_tokens: 150,
            num_completion_tokens: 30,
          }),
        ])
      )
    })

    it('should not call trackLlmRuns when not in production', async () => {
      mockIsProd = false
      mockRunnerRunImpl.mockResolvedValueOnce({
        finalOutput: {
          messages: [{ type: 'text', content: { text: 'Hi' } }],
        },
        rawResponses: [makeRawResponse(100, 20)],
        state: { _currentAgent: { name: 'RouterAgent' } },
      })

      const runner = new RouterRunner(
        mockAgent,
        mockLlmConfig,
        'test-inference-id',
        mockLogger
      )

      await runner.run(sampleMessages, mockContext)

      expect(mockTrackLlmRuns).not.toHaveBeenCalled()
    })

    it('should not call trackLlmRuns when rawResponses is empty', async () => {
      mockRunnerRunImpl.mockResolvedValueOnce({
        finalOutput: {
          messages: [{ type: 'text', content: { text: 'Hi' } }],
        },
        rawResponses: [],
        state: { _currentAgent: { name: 'RouterAgent' } },
      })

      const runner = new RouterRunner(
        mockAgent,
        mockLlmConfig,
        'test-inference-id',
        mockLogger
      )

      await runner.run(sampleMessages, mockContext)

      expect(mockTrackLlmRuns).not.toHaveBeenCalled()
    })

    it('should use deployment_name as fallback model_name when providerData.model is missing', async () => {
      mockRunnerRunImpl.mockResolvedValueOnce({
        finalOutput: {
          messages: [{ type: 'text', content: { text: 'Hi' } }],
        },
        rawResponses: [makeRawResponse(100, 20)],
        state: { _currentAgent: { name: 'RouterAgent' } },
      })

      const runner = new RouterRunner(
        mockAgent,
        mockLlmConfig,
        'test-inference-id',
        mockLogger
      )

      await runner.run(sampleMessages, mockContext)

      expect(mockTrackLlmRuns).toHaveBeenCalledWith(
        'test-bot-id',
        expect.objectContaining({
          llm_runs: [expect.objectContaining({ model_name: 'gpt-4.1-mini' })],
        })
      )
    })
  })
})
