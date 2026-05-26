import type { DebugLogger } from '../src/debug-logger'
import type { LLMConfig } from '../src/llm-config'
import type {
  AgenticInputMessage,
  AIAgent,
  Context,
  GuardrailRule,
} from '../src/types'

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

type RunnerConfig = {
  modelSettings?: LLMConfig['modelSettings']
  modelProvider?: LLMConfig['modelProvider']
  tracingDisabled: boolean
}

// Captured runner config for assertions
let capturedRunnerConfig: any = null
let capturedRunnerConfigs: RunnerConfig[] = []
let capturedAgentConfigs: any[] = []
const mockRunnerRunImpl: jest.Mock = jest.fn()

jest.mock('@openai/agents', () => {
  const MockAgent = jest
    .fn()
    .mockImplementation(
      (config: {
        name: string
        model?: unknown
        modelSettings?: LLMConfig['modelSettings']
        instructions?: string
        tools?: unknown[]
        outputType?: unknown
      }) => {
        capturedAgentConfigs.push(config)
        return {
          name: config.name,
          instructions: config.instructions,
          tools: config.tools ?? [],
          model: config.model,
          modelSettings: config.modelSettings,
          outputType: config.outputType,
        }
      }
    )

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
    capturedRunnerConfigs.push(config)
    return {
      run: mockRunnerRunImpl,
    }
  })

  return {
    Agent: MockAgent,
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
  RETRIEVE_KNOWLEDGE_TOOL_NAME: 'retrieve_knowledge',
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
import { createInputGuardrails } from '../src/guardrails/input'
import { SpecialistRunner } from '../src/runners/specialist-runner'

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
      reasoning: { effort: 'low' },
      text: { verbosity: 'medium' },
      toolChoice: undefined as string | undefined,
    },
    modelProvider: { provider },
    getModel: jest.fn().mockResolvedValue({ id: 'guardrail-model' }),
    getProviderName: jest.fn().mockReturnValue(provider),
    getApiVersion: jest.fn().mockReturnValue('2025-01-01-preview'),
  } as unknown as LLMConfig
}

function buildMockAgent(
  includeRetrieveKnowledge = false,
  modelSettings: Record<string, unknown> = {}
): AIAgent<any, any> {
  return {
    name: 'TestAgent',
    tools: includeRetrieveKnowledge ? [mockRetrieveKnowledge] : [],
    modelSettings,
  } as unknown as AIAgent<any, any>
}

function buildMockContext(): Context {
  return {
    authToken: 'test-token',
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
function makeTextRunnerResult(
  text = 'OK',
  overrides: Record<string, unknown> = {}
) {
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

/** Creates a WorkerAgentRunner with sensible defaults */
function createRunner(
  agent = buildMockAgent(),
  llmConfig = buildMockLlmConfig()
): SpecialistRunner {
  return new SpecialistRunner(agent, llmConfig, 'test-inference-id', mockLogger)
}

const sampleMessages: AgenticInputMessage[] = [
  { role: 'user', content: 'Hello' } as any,
]

// ── tests ─────────────────────────────────────────────────────────────────────

describe('WorkerAgentRunner', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    capturedRunnerConfig = null
    capturedRunnerConfigs = []
    capturedAgentConfigs = []
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
      expect(createRunner()).toBeInstanceOf(SpecialistRunner)
    })
  })

  // ── run() – happy path ───────────────────────────────────────────────────

  describe('run() – happy path', () => {
    it('should return messages and exit: false when output contains non-exit messages', async () => {
      const outputMessages = [{ type: 'text', content: { text: 'Hi there!' } }]
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeRunnerResult({ finalOutput: { messages: outputMessages } })
      )

      const result = await createRunner().run(
        sampleMessages,
        buildMockContext()
      )

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

      const result = await createRunner().run(
        sampleMessages,
        buildMockContext()
      )

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

      const result = await createRunner().run(
        sampleMessages,
        buildMockContext()
      )

      expect(result.exit).toBe(true)
      expect(result.messages).toEqual([])
    })

    it('should handle undefined finalOutput gracefully', async () => {
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeRunnerResult({ finalOutput: undefined })
      )

      const result = await createRunner().run(
        sampleMessages,
        buildMockContext()
      )

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

      const result = await createRunner().run(
        sampleMessages,
        buildMockContext()
      )

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

      const result = await createRunner(buildMockAgent(true)).run(
        sampleMessages,
        context
      )

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

      const result = await createRunner().run(
        sampleMessages,
        buildMockContext()
      )

      // Items with empty toolName are filtered out
      expect(result.toolsExecuted).toHaveLength(0)
    })

    it('should handle malformed JSON tool arguments gracefully', async () => {
      const toolItem = makeToolCallItem('my_tool', 'NOT_VALID_JSON')
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeTextRunnerResult('OK', { newItems: [toolItem] })
      )

      const result = await createRunner().run(
        sampleMessages,
        buildMockContext()
      )

      expect(result.toolsExecuted[0].toolArguments).toEqual({})
    })

    it('should handle undefined newItems gracefully', async () => {
      mockRunnerRunImpl.mockResolvedValueOnce(
        makeTextRunnerResult('OK', { newItems: undefined })
      )

      const result = await createRunner().run(
        sampleMessages,
        buildMockContext()
      )

      expect(result.toolsExecuted).toEqual([])
    })
  })

  // ── run() – provider logic ───────────────────────────────────────────────

  describe('run() – provider logic', () => {
    it('should not mutate llmConfig toolChoice for azure provider when agent has retrieve_knowledge', async () => {
      mockConstants.OPENAI_PROVIDER = 'azure'
      mockRunnerRunImpl.mockResolvedValueOnce(makeTextRunnerResult())

      const llmConfig = buildMockLlmConfig('azure')
      const agent = buildMockAgent(true, { toolChoice: 'retrieve_knowledge' })
      await createRunner(agent, llmConfig).run(
        sampleMessages,
        buildMockContext()
      )

      expect(agent.modelSettings.toolChoice).toBe('retrieve_knowledge')
      expect(llmConfig.modelSettings.toolChoice).toBeUndefined()
    })

    it('should keep retrieve_knowledge for the main agent but clear toolChoice for input guardrails', async () => {
      mockConstants.OPENAI_PROVIDER = 'azure'
      const llmConfig = buildMockLlmConfig('azure')
      llmConfig.modelSettings.toolChoice = 'retrieve_knowledge'
      const guardrailRules: GuardrailRule[] = [
        {
          name: 'is_offensive',
          description: 'Whether the user input is offensive.',
        },
      ]
      const [inputGuardrail] = await createInputGuardrails(
        guardrailRules,
        llmConfig,
        {
          botId: 'test-bot-id',
          isTest: false,
          authToken: 'test-token',
          inferenceId: 'test-inference-id',
        }
      )
      const agent = {
        ...buildMockAgent(true),
        inputGuardrails: [inputGuardrail],
      } as AIAgent

      // Simulates the OpenAI runner executing the input guardrails before the
      // main agent output is produced.
      mockRunnerRunImpl
        .mockImplementationOnce(async (agentArg, messages, options) => {
          await agentArg.inputGuardrails[0].execute({
            input: messages,
            context: options.context,
            agent: agentArg,
          })
          return makeTextRunnerResult()
        })
        .mockResolvedValueOnce({
          finalOutput: { is_offensive: false },
          rawResponses: [],
        })

      await createRunner(agent, llmConfig).run(
        sampleMessages,
        buildMockContext()
      )

      expect(capturedRunnerConfigs).toHaveLength(2)
      expect(capturedRunnerConfigs).toEqual([
        { tracingDisabled: true },
        { tracingDisabled: true },
      ])
      expect(capturedAgentConfigs).toHaveLength(1)
      expect(capturedAgentConfigs[0].modelSettings).not.toBe(
        llmConfig.modelSettings
      )
      expect(capturedAgentConfigs[0].modelSettings).toHaveProperty(
        'toolChoice',
        undefined
      )
      expect(capturedAgentConfigs[0].modelSettings.reasoning).toEqual(
        llmConfig.modelSettings.reasoning
      )
      expect(capturedAgentConfigs[0].modelSettings.reasoning).not.toBe(
        llmConfig.modelSettings.reasoning
      )
      expect(capturedAgentConfigs[0].modelSettings.text).toEqual(
        llmConfig.modelSettings.text
      )
      expect(capturedAgentConfigs[0].modelSettings.text).not.toBe(
        llmConfig.modelSettings.text
      )
      expect(llmConfig.modelSettings.toolChoice).toBe('retrieve_knowledge')
    })

    it('should NOT set toolChoice for openai provider even with retrieve_knowledge tool', async () => {
      mockConstants.OPENAI_PROVIDER = 'openai'
      mockRunnerRunImpl.mockResolvedValueOnce(makeTextRunnerResult())

      const llmConfig = buildMockLlmConfig('openai')
      await createRunner(buildMockAgent(true), llmConfig).run(
        sampleMessages,
        buildMockContext()
      )

      expect(llmConfig.modelSettings.toolChoice).toBeUndefined()
    })

    it('should NOT set toolChoice when agent does not have retrieve_knowledge', async () => {
      mockConstants.OPENAI_PROVIDER = 'azure'
      mockRunnerRunImpl.mockResolvedValueOnce(makeTextRunnerResult())

      const llmConfig = buildMockLlmConfig('azure')
      await createRunner(buildMockAgent(false), llmConfig).run(
        sampleMessages,
        buildMockContext()
      )

      expect(llmConfig.modelSettings.toolChoice).toBeUndefined()
    })

    it('should create Runner with execution settings only', async () => {
      mockRunnerRunImpl.mockResolvedValueOnce(makeTextRunnerResult())

      const llmConfig = buildMockLlmConfig()
      await createRunner(buildMockAgent(), llmConfig).run(
        sampleMessages,
        buildMockContext()
      )

      expect(capturedRunnerConfig).toEqual({
        tracingDisabled: true,
      })
      expect(capturedRunnerConfig).not.toHaveProperty('modelSettings')
      expect(capturedRunnerConfig).not.toHaveProperty('modelProvider')
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

      const result = await createRunner().run(
        sampleMessages,
        buildMockContext()
      )

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
            expect.objectContaining({
              num_prompt_tokens: 100,
              num_completion_tokens: 20,
            }),
            expect.objectContaining({
              num_prompt_tokens: 150,
              num_completion_tokens: 30,
            }),
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
