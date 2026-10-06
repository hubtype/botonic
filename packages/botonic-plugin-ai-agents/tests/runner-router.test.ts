import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { DebugLogger } from '../src/debug-logger'
import type { LLMConfig } from '../src/llm-config'
import type { AgenticInputMessage, AIAgent, Context } from '../src/types'
import { getLastMockCallArg } from './helpers/mock-utils'

const mockTrackLlmRuns = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))
const mockRunnerRunImpl = vi.hoisted(() => vi.fn())
const mockRunner = vi.hoisted(() =>
  vi.fn(function RunnerConstructor(_config: Record<string, unknown>) {
    return {
      run: mockRunnerRunImpl,
    }
  })
)

vi.mock('../src/services/hubtype-api-client', () => ({
  HubtypeApiClient: vi.fn().mockImplementation(function HubtypeApiClientMock() {
    return {
      trackLlmRuns: mockTrackLlmRuns,
    }
  }),
}))

const mockConstants = vi.hoisted(() => ({
  LLM_PROVIDER: 'azure',
  LLM_PROVIDERS: { OPENAI: 'openai', AZURE: 'azure', LITELLM: 'litellm' },
  LLM_OPENAI_MODEL: 'gpt-4.1-mini',
  LLM_AZURE_API_VERSION: '2025-01-01-preview',
}))

vi.mock('@openai/agents', () => {
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

  return {
    Runner: mockRunner,
    RunContext: MockRunContext,
    InputGuardrailTripwireTriggered: MockInputGuardrailTripwireTriggered,
  }
})

let RouterRunner: typeof import('../src/runners/router-runner').RouterRunner
async function loadRunner(isProd: boolean) {
  vi.resetModules()
  vi.doMock('../src/constants', () => ({ ...mockConstants, isProd }))
  ;({ RouterRunner } = await import('../src/runners/router-runner'))
}

const mockLogger: DebugLogger = {
  logInitialConfig: vi.fn(),
  logAgentDebugInfo: vi.fn(),
  logModelSettings: vi.fn(),
  logRunnerStart: vi.fn(),
  logRunResult: vi.fn(),
  logGuardrailTriggered: vi.fn(),
  logRunnerError: vi.fn(),
  logToolExecution: vi.fn(),
}

const mockLlmConfig = {
  modelName: 'gpt-4.1-mini',
  modelSettings: { temperature: 0 },
  modelProvider: {},
  getApiVersion: vi.fn().mockReturnValue('test-api-version'),
  getProviderName: vi.fn().mockReturnValue('azure'),
} as unknown as LLMConfig

const mockAgent = {
  name: 'RouterAgent',
  tools: [],
  modelSettings: { temperature: 0 },
  getSystemPrompt: vi.fn().mockResolvedValue('test system prompt'),
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
  beforeEach(async () => {
    vi.clearAllMocks()
    await loadRunner(false)
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

    expect(mockRunner).toHaveBeenCalledWith({ tracingDisabled: true })
    const runnerConfig = getLastMockCallArg<Record<string, unknown>>(mockRunner)
    expect(runnerConfig).not.toHaveProperty('modelSettings')
    expect(runnerConfig).not.toHaveProperty('modelProvider')
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
    beforeEach(async () => {
      await loadRunner(true)
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
      await loadRunner(false)
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
