// biome-ignore lint/correctness/noUnusedImports: we need to import Runner to mock it
import { Agent, type RunContext, Runner, type Usage } from '@openai/agents'

import {
  createInputGuardrail,
  type GuardrailTrackingContext,
} from '../../src/guardrails/input'
import type { LLMConfig } from '../../src/llm-config'
import type { GuardrailRule } from '../../src/types'

const mockRunnerRun = jest.fn()
const mockTrackLlmRuns = jest.fn().mockResolvedValue(undefined)

// Mock OpenAI Agent and Runner
jest.mock('@openai/agents', () => ({
  Agent: jest.fn().mockImplementation(config => ({
    name: config.name,
    instructions: config.instructions,
    outputType: config.outputType,
  })),
  Runner: jest.fn().mockImplementation(() => ({
    run: mockRunnerRun,
  })),
}))

jest.mock('../../src/services/hubtype-api-client', () => ({
  HubtypeApiClient: jest.fn().mockImplementation(() => ({
    trackLlmRuns: mockTrackLlmRuns,
  })),
}))

jest.mock('../../src/constants', () => ({
  isProd: false,
  OPENAI_PROVIDER: 'azure',
  AZURE_OPENAI_API_VERSION: '2025-01-01-preview',
}))

describe('createInputGuardrail', () => {
  const mockRules: GuardrailRule[] = [
    {
      name: 'is_offensive',
      description: 'Whether the user input is offensive.',
    },
    {
      name: 'is_spam',
      description: 'Whether the user input is spam.',
    },
  ]

  const mockUsage: Usage = {
    totalTokens: 0,
    requests: 0,
    inputTokens: 0,
    outputTokens: 0,
    inputTokensDetails: [] as Record<string, number>[],
    outputTokensDetails: [] as Record<string, number>[],
    requestUsageEntries: undefined,
    add: jest.fn(),
  }

  const mockRunContext = {
    context: {},
    usage: mockUsage,
    isToolApproved: () => true,
    approveTool: () => {},
    rejectTool: () => {},
    toJSON: () => ({}),
    '#private': Symbol('private'),
  } as unknown as RunContext<unknown>

  const mockAgent = new Agent({
    name: 'TestAgent',
    instructions: 'Test instructions',
    outputType: undefined,
  })

  const mockLlmConfig = {
    modelName: 'gpt-4.1-mini',
    modelSettings: { temperature: 0, text: { verbosity: 'medium' } },
    modelProvider: {},
  } as unknown as LLMConfig

  const mockTrackingContext: GuardrailTrackingContext = {
    botId: 'test-bot-id',
    isTest: false,
    authToken: 'test-token',
    inferenceId: 'test-inference-id',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.requireMock('../../src/constants').isProd = false
  })

  it('should create a guardrail with the correct configuration', () => {
    const guardrail = createInputGuardrail(
      mockRules,
      mockLlmConfig,
      mockTrackingContext
    )

    expect(guardrail.name).toBe('InputGuardrail')
    expect(Agent).toHaveBeenCalledWith({
      name: 'InputGuardrail',
      model: mockLlmConfig.modelName,
      instructions:
        'Check if the user triggers some of the following guardrails.',
      outputType: expect.any(Object),
    })
  })

  it('should return triggered guardrails when rules are violated', async () => {
    const mockAgentOutput = {
      finalOutput: {
        is_offensive: true,
        is_spam: false,
      },
    }
    mockRunnerRun.mockResolvedValue(mockAgentOutput)

    const guardrail = createInputGuardrail(
      mockRules,
      mockLlmConfig,
      mockTrackingContext
    )
    const result = await guardrail.execute({
      input: [
        {
          role: 'user',
          content: [{ type: 'input_text', text: 'some offensive text' }],
        },
      ],
      context: mockRunContext,
      agent: mockAgent,
    })

    expect(result).toEqual({
      outputInfo: ['is_offensive'],
      tripwireTriggered: true,
    })
    expect(mockRunnerRun).toHaveBeenCalledWith(
      expect.any(Object),
      [
        {
          role: 'user',
          content: [{ type: 'input_text', text: 'some offensive text' }],
        },
      ],
      { context: mockRunContext }
    )
  })

  it('should return no triggered guardrails when no rules are violated', async () => {
    const mockAgentOutput = {
      finalOutput: {
        is_offensive: false,
        is_spam: false,
      },
    }
    mockRunnerRun.mockResolvedValue(mockAgentOutput)

    const guardrail = createInputGuardrail(
      mockRules,
      mockLlmConfig,
      mockTrackingContext
    )
    const result = await guardrail.execute({
      input: [
        {
          role: 'user',
          content: [{ type: 'input_text', text: 'normal text' }],
        },
      ],
      context: mockRunContext,
      agent: mockAgent,
    })

    expect(result).toEqual({
      outputInfo: [],
      tripwireTriggered: false,
    })
  })

  it('should throw error when agent fails to produce output', async () => {
    const mockAgentOutput = {
      finalOutput: undefined,
    }
    mockRunnerRun.mockResolvedValue(mockAgentOutput)

    const guardrail = createInputGuardrail(
      mockRules,
      mockLlmConfig,
      mockTrackingContext
    )
    await expect(
      guardrail.execute({
        input: [
          {
            role: 'user',
            content: [{ type: 'input_text', text: 'some text' }],
          },
        ],
        context: mockRunContext,
        agent: mockAgent,
      })
    ).rejects.toThrow('Guardrail agent failed to produce output')
  })

  it('should call trackLlmRuns after guardrail execution in production', async () => {
    jest.requireMock('../../src/constants').isProd = true
    const mockAgentOutput = {
      finalOutput: { is_offensive: false, is_spam: false },
      rawResponses: [
        {
          usage: { inputTokens: 100, outputTokens: 20 },
          providerData: { model: 'gpt-4.1-mini-2025-04-14' },
        },
      ],
    }
    mockRunnerRun.mockResolvedValue(mockAgentOutput)

    const guardrail = createInputGuardrail(
      mockRules,
      mockLlmConfig,
      mockTrackingContext
    )
    await guardrail.execute({
      input: [
        {
          role: 'user',
          content: [{ type: 'input_text', text: 'hello' }],
        },
      ],
      context: mockRunContext,
      agent: mockAgent,
    })

    // Allow fire-and-forget promise to resolve
    await Promise.resolve()

    expect(mockTrackLlmRuns).toHaveBeenCalledWith(
      'test-bot-id',
      expect.objectContaining({
        llm_runs: [
          expect.objectContaining({
            is_test: false,
            deployment_name: 'gpt-4.1-mini',
            model_name: 'gpt-4.1-mini-2025-04-14',
            num_prompt_tokens: 100,
            num_completion_tokens: 20,
            temperature: 0,
          }),
        ],
      })
    )
  })
})
