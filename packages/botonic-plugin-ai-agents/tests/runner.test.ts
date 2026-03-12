import type { DebugLogger } from '../src/debug-logger'
import type { LLMConfig } from '../src/llm-config'
import type { AgenticInputMessage, AIAgent, Context } from '../src/types'

const mockTrackLlmRuns = jest.fn().mockResolvedValue(undefined)

jest.mock('../src/services/hubtype-api-client', () => ({
  HubtypeApiClient: jest.fn().mockImplementation(() => ({
    trackLlmRuns: mockTrackLlmRuns,
  })),
}))

// Mock DebugLogger (no-op)
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

// Captured runner config for assertions
let capturedRunnerConfig: any = null
const mockRunnerRunImpl: jest.Mock = jest.fn()

jest.mock('@openai/agents', () => {
  class MockRunToolCallItem {
    rawItem: any
    constructor(rawItem: any) {
      this.rawItem = rawItem
    }
  }

  class MockRunToolCallOutputItem {
    rawItem: any
    constructor(rawItem: any) {
      this.rawItem = rawItem
    }
  }

  class MockInputGuardrailTripwireTriggered extends Error {
    result: any
    constructor(result: any) {
      super('InputGuardrailTripwireTriggered')
      this.result = result
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
    RunToolCallItem: MockRunToolCallItem,
    RunToolCallOutputItem: MockRunToolCallOutputItem,
    InputGuardrailTripwireTriggered: MockInputGuardrailTripwireTriggered,
  }
})

const mockRetrieveKnowledge = {
  name: 'retrieve_knowledge',
  description: 'Consult the knowledge base for information before answering.',
}

jest.mock('../src/tools', () => ({
  mandatoryTools: [],
  retrieveKnowledge: mockRetrieveKnowledge,
}))

const mockConstants = {
  OPENAI_PROVIDER: 'azure' as 'openai' | 'azure',
  OPENAI_MODEL: 'gpt-4.1-mini',
  AZURE_OPENAI_API_VERSION: '2025-01-01-preview',
  isProd: false,
}

jest.mock('../src/constants', () => mockConstants)

// Import after mocks
import { RunToolCallItem } from '@openai/agents'
import { AIAgentRunner } from '../src/runner'

// ── helpers ──────────────────────────────────────────────────────────────────

function makeToolCallItem(
  name: string,
  args: string,
  type = 'function_call'
): InstanceType<typeof RunToolCallItem> {
  return new RunToolCallItem(
    { type, name, arguments: args } as any,
    {} as any
  ) as any
}

function buildMockLlmConfig(provider: 'openai' | 'azure' = 'azure'): LLMConfig {
  return {
    modelName: 'gpt-4.1-mini',
    modelSettings: {
      temperature: 0,
      toolChoice: undefined as string | undefined,
    },
    modelProvider: { provider },
  } as unknown as LLMConfig
}

function buildMockAgent(includeRetrieveKnowledge = false): AIAgent<any, any> {
  return {
    name: 'TestAgent',
    tools: includeRetrieveKnowledge ? [mockRetrieveKnowledge] : [],
  } as unknown as AIAgent<any, any>
}

function buildMockContext(): Context {
  return {
    authToken: 'test-token',
    sourceIds: [],
    knowledgeUsed: {
      query: '',
      sourceIds: ['src-1'],
      chunksIds: ['chunk-1'],
      chunkTexts: [],
    },
    request: {
      session: {
        bot: { id: 'test-bot-id' },
        is_test_integration: false,
      },
    } as any,
  }
}

/** Returns a mock runner.run() result that always includes the required `state` field */
function makeRunnerResult(overrides: Record<string, unknown> = {}) {
  return {
    finalOutput: { messages: [] },
    newItems: [],
    rawResponses: [],
    state: { _context: {} },
    ...overrides,
  }
}

/** Shortcut for the common case: a successful run returning a single text message */
function makeTextRunnerResult(text = 'OK', overrides: Record<string, unknown> = {}) {
  return makeRunnerResult({
    finalOutput: { messages: [{ type: 'text', content: { text } }] },
    ...overrides,
  })
}

/** Shortcut for a single rawResponse entry */
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

/** Creates an AIAgentRunner with sensible defaults */
function createRunner(
  agent = buildMockAgent(),
  llmConfig = buildMockLlmConfig()
): AIAgentRunner {
  return new AIAgentRunner(agent, llmConfig, 'test-inference-id', mockLogger)
}

const sampleMessages: AgenticInputMessage[] = [
  { role: 'user', content: 'Hello' } as any,
]

// ── tests ─────────────────────────────────────────────────────────────────────

describe('AIAgentRunner', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    capturedRunnerConfig = null
    mockConstants.OPENAI_PROVIDER = 'azure'
    mockConstants.isProd = false
  })

  afterEach(() => {
    jest.restoreAllMocks()
    mockConstants.OPENAI_PROVIDER = 'azure'
    mockConstants.isProd = false
  })

  // ── constructor ──────────────────────────────────────────────────────────

  describe('constructor', () => {
    it('should instantiate without errors', () => {
      expect(createRunner()).toBeInstanceOf(AIAgentRunner)
    })
  })

  // ── run() – happy path ───────────────────────────────────────────────────

  describe('run() – happy path', () => {
    it('should return messages and exit: false when output contains non-exit messages', async () => {
      const outputMessages = [{ type: 'text', content: { text: 'Hi there!' } }]
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeRunnerResult({ finalOutput: { messages: outputMessages } })
      )

      const result = await createRunner().run(sampleMessages, buildMockContext())

      expect(result.messages).toEqual(outputMessages)
      expect(result.exit).toBe(false)
      expect(result.error).toBe(false)
      expect(result.toolsExecuted).toEqual([])
      expect(result.inputGuardrailsTriggered).toEqual([])
      expect(result.outputGuardrailsTriggered).toEqual([])
      expect(result.memoryLength).toBe(sampleMessages.length)
    })

    it('should set exit: true when finalOutput has no messages', async () => {
      mockRunnerRunImpl.mockResolvedValueOnce(makeRunnerResult())

      const result = await createRunner().run(sampleMessages, buildMockContext())

      expect(result.exit).toBe(true)
      expect(result.messages).toEqual([])
    })

    it('should set exit: true and strip exit-type messages', async () => {
      const outputMessages = [
        { type: 'text', content: { text: 'Bye' } },
        { type: 'exit' },
      ]
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeRunnerResult({ finalOutput: { messages: outputMessages } })
      )

      const result = await createRunner().run(sampleMessages, buildMockContext())

      expect(result.exit).toBe(true)
      expect(result.messages).toEqual([])
    })

    it('should handle undefined finalOutput gracefully', async () => {
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeRunnerResult({ finalOutput: undefined })
      )

      const result = await createRunner().run(sampleMessages, buildMockContext())

      expect(result.exit).toBe(true)
      expect(result.messages).toEqual([])
    })

    it('should call logRunnerStart and logRunResult', async () => {
      mockRunnerRunImpl.mockResolvedValueOnce(makeTextRunnerResult())

      await createRunner().run(sampleMessages, buildMockContext())

      expect(mockLogger.logRunnerStart).toHaveBeenCalledTimes(1)
      expect(mockLogger.logRunResult).toHaveBeenCalledTimes(1)
    })
  })

  // ── run() – tools executed ───────────────────────────────────────────────

  describe('run() – tools executed', () => {
    it('should map function_call items to ToolExecution', async () => {
      const toolItem = makeToolCallItem('my_tool', '{"param":"value"}')
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeTextRunnerResult('Done', { newItems: [toolItem] })
      )

      const result = await createRunner().run(sampleMessages, buildMockContext())

      expect(result.toolsExecuted).toHaveLength(1)
      expect(result.toolsExecuted[0]).toMatchObject({
        toolName: 'my_tool',
        toolArguments: { param: 'value' },
      })
    })

    it('should include knowledgebase info for retrieve_knowledge tool', async () => {
      const toolItem = makeToolCallItem(
        'retrieve_knowledge',
        '{"query":"test query"}'
      )
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeTextRunnerResult('Done', { newItems: [toolItem] })
      )

      const context = buildMockContext()
      context.knowledgeUsed.sourceIds = ['src-1', 'src-2']
      context.knowledgeUsed.chunksIds = ['chunk-1']

      const result = await createRunner(buildMockAgent(true)).run(sampleMessages, context)

      expect(result.toolsExecuted[0]).toMatchObject({
        toolName: 'retrieve_knowledge',
        toolArguments: { query: 'test query' },
        knowledgebaseSourcesIds: ['src-1', 'src-2'],
        knowledgebaseChunksIds: ['chunk-1'],
      })
    })

    it('should skip items that are not function_call type', async () => {
      const nonFunctionItem = makeToolCallItem('ignored', '{}', 'computer_call')
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeTextRunnerResult('OK', { newItems: [nonFunctionItem] })
      )

      const result = await createRunner().run(sampleMessages, buildMockContext())

      // Items with empty toolName are filtered out
      expect(result.toolsExecuted).toHaveLength(0)
    })

    it('should handle malformed JSON tool arguments gracefully', async () => {
      const toolItem = makeToolCallItem('my_tool', 'NOT_VALID_JSON')
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeTextRunnerResult('OK', { newItems: [toolItem] })
      )

      const result = await createRunner().run(sampleMessages, buildMockContext())

      expect(result.toolsExecuted[0].toolArguments).toEqual({})
    })

    it('should handle undefined newItems gracefully', async () => {
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeTextRunnerResult('OK', { newItems: undefined })
      )

      const result = await createRunner().run(sampleMessages, buildMockContext())

      expect(result.toolsExecuted).toEqual([])
    })
  })

  // ── run() – provider logic ───────────────────────────────────────────────

  describe('run() – provider logic', () => {
    it('should set toolChoice to retrieve_knowledge for azure provider when agent has that tool', async () => {
      mockConstants.OPENAI_PROVIDER = 'azure'
      mockRunnerRunImpl.mockResolvedValueOnce(makeTextRunnerResult())

      const llmConfig = buildMockLlmConfig('azure')
      await createRunner(buildMockAgent(true), llmConfig).run(sampleMessages, buildMockContext())

      expect(llmConfig.modelSettings.toolChoice).toBe('retrieve_knowledge')
    })

    it('should NOT set toolChoice for openai provider even with retrieve_knowledge tool', async () => {
      mockConstants.OPENAI_PROVIDER = 'openai'
      mockRunnerRunImpl.mockResolvedValueOnce(makeTextRunnerResult())

      const llmConfig = buildMockLlmConfig('openai')
      await createRunner(buildMockAgent(true), llmConfig).run(sampleMessages, buildMockContext())

      expect(llmConfig.modelSettings.toolChoice).toBeUndefined()
    })

    it('should NOT set toolChoice when agent does not have retrieve_knowledge', async () => {
      mockConstants.OPENAI_PROVIDER = 'azure'
      mockRunnerRunImpl.mockResolvedValueOnce(makeTextRunnerResult())

      const llmConfig = buildMockLlmConfig('azure')
      await createRunner(buildMockAgent(false), llmConfig).run(sampleMessages, buildMockContext())

      expect(llmConfig.modelSettings.toolChoice).toBeUndefined()
    })

    it('should pass modelProvider and modelSettings to Runner', async () => {
      mockRunnerRunImpl.mockResolvedValueOnce(makeTextRunnerResult())

      const llmConfig = buildMockLlmConfig()
      await createRunner(buildMockAgent(), llmConfig).run(sampleMessages, buildMockContext())

      expect(capturedRunnerConfig).toMatchObject({
        modelSettings: llmConfig.modelSettings,
        modelProvider: llmConfig.modelProvider,
        tracingDisabled: true,
      })
    })
  })

  // ── run() – error handling ───────────────────────────────────────────────

  describe('run() – error handling', () => {
    it('should handle InputGuardrailTripwireTriggered and return guardrail result', async () => {
      const { InputGuardrailTripwireTriggered } = require('@openai/agents')
      const guardrailOutput = [{ name: 'is_offensive', triggered: true }]
      const guardrailError = new InputGuardrailTripwireTriggered({
        output: { outputInfo: guardrailOutput },
      })
      mockRunnerRunImpl.mockRejectedValueOnce(guardrailError)

      const result = await createRunner().run(sampleMessages, buildMockContext())

      expect(result.exit).toBe(true)
      expect(result.error).toBe(false)
      expect(result.messages).toEqual([])
      expect(result.toolsExecuted).toEqual([])
      expect(result.inputGuardrailsTriggered).toEqual(guardrailOutput)
      expect(result.outputGuardrailsTriggered).toEqual([])
      expect(result.memoryLength).toBe(0)
    })

    it('should call logGuardrailTriggered and logRunResult when guardrail fires', async () => {
      const { InputGuardrailTripwireTriggered } = require('@openai/agents')
      const guardrailError = new InputGuardrailTripwireTriggered({
        output: { outputInfo: [] },
      })
      mockRunnerRunImpl.mockRejectedValueOnce(guardrailError)

      await createRunner().run(sampleMessages, buildMockContext())

      expect(mockLogger.logGuardrailTriggered).toHaveBeenCalledTimes(1)
      expect(mockLogger.logRunResult).toHaveBeenCalledTimes(1)
    })

    it('should re-throw unknown errors and call logRunnerError', async () => {
      const unexpectedError = new Error('LLM connection failed')
      mockRunnerRunImpl.mockRejectedValueOnce(unexpectedError)

      await expect(
        createRunner().run(sampleMessages, buildMockContext())
      ).rejects.toThrow('LLM connection failed')
      expect(mockLogger.logRunnerError).toHaveBeenCalledTimes(1)
      expect(mockLogger.logRunResult).not.toHaveBeenCalled()
    })
  })

  describe('run() – LLM run tracking', () => {
    beforeEach(() => {
      mockConstants.isProd = true
    })

    it('should call trackLlmRuns after a successful run in production', async () => {
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeTextRunnerResult('Hi', {
          rawResponses: [makeRawResponse(200, 50, 'gpt-4.1-mini-2025-04-14')],
        })
      )

      await createRunner().run(sampleMessages, buildMockContext())
      await Promise.resolve()

      expect(mockTrackLlmRuns).toHaveBeenCalledWith(
        'test-bot-id',
        expect.objectContaining({
          llm_runs: [
            expect.objectContaining({
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
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeTextRunnerResult('Hi', {
          rawResponses: [
            makeRawResponse(100, 20, 'gpt-4.1-mini-2025-04-14'),
            makeRawResponse(150, 30, 'gpt-4.1-mini-2025-04-14'),
          ],
        })
      )

      await createRunner().run(sampleMessages, buildMockContext())
      await Promise.resolve()

      expect(mockTrackLlmRuns).toHaveBeenCalledWith(
        'test-bot-id',
        expect.objectContaining({
          llm_runs: expect.arrayContaining([
            expect.objectContaining({ num_prompt_tokens: 100, num_completion_tokens: 20 }),
            expect.objectContaining({ num_prompt_tokens: 150, num_completion_tokens: 30 }),
          ]),
        })
      )
      const payload = mockTrackLlmRuns.mock.calls[0][1]
      expect(payload.llm_runs).toHaveLength(2)
    })

    it('should NOT call trackLlmRuns when not in production', async () => {
      mockConstants.isProd = false
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeTextRunnerResult('Hi', { rawResponses: [makeRawResponse(100, 20)] })
      )

      await createRunner().run(sampleMessages, buildMockContext())
      await Promise.resolve()

      expect(mockTrackLlmRuns).not.toHaveBeenCalled()
    })

    it('should NOT call trackLlmRuns when rawResponses is empty', async () => {
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeTextRunnerResult('Hi', { rawResponses: [] })
      )

      await createRunner().run(sampleMessages, buildMockContext())
      await Promise.resolve()

      expect(mockTrackLlmRuns).not.toHaveBeenCalled()
    })

    it('should use deployment_name as fallback model_name when providerData.model is missing', async () => {
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeTextRunnerResult('Hi', { rawResponses: [makeRawResponse(100, 20)] })
      )

      await createRunner().run(sampleMessages, buildMockContext())
      await Promise.resolve()

      expect(mockTrackLlmRuns).toHaveBeenCalledWith(
        'test-bot-id',
        expect.objectContaining({
          llm_runs: [expect.objectContaining({ model_name: 'gpt-4.1-mini' })],
        })
      )
    })
  })
})
