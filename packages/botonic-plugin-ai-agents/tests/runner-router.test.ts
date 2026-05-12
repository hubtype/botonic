import type { DebugLogger } from '../src/debug-logger'
import type { LLMConfig } from '../src/llm-config'
import { AIAgentRouterRunner } from '../src/runner-router'
import type { AgenticInputMessage, AIAgent, Context } from '../src/types'

const mockRunnerRunImpl = jest.fn()
let capturedRunnerConfig: any = null

jest.mock('@openai/agents', () => {
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
    InputGuardrailTripwireTriggered: MockInputGuardrailTripwireTriggered,
  }
})

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
} as unknown as LLMConfig

const mockAgent = {
  name: 'RouterAgent',
  tools: [],
  modelSettings: { temperature: 0 },
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

describe('AIAgentRouterRunner', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    capturedRunnerConfig = null
  })

  it('should create Runner with execution settings only', async () => {
    mockRunnerRunImpl.mockResolvedValueOnce({
      finalOutput: {
        messages: [{ type: 'text', content: { text: 'Hi' } }],
      },
      state: { _currentAgent: { name: 'RouterAgent' } },
    })

    const runner = new AIAgentRouterRunner(
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

    const runner = new AIAgentRouterRunner(
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

    const runner = new AIAgentRouterRunner(
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

    const runner = new AIAgentRouterRunner(
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

    const runner = new AIAgentRouterRunner(
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
})
