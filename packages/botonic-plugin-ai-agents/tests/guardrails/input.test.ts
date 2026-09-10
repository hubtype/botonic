import { Agent, type RunContext, type Usage } from '@openai/agents'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { GuardrailTrackingContext } from '../../src/guardrails/input'
import type { LLMConfig } from '../../src/llm-config'
import type { GuardrailRule } from '../../src/types'
import { getLastMockCallArg } from '../helpers/mock-utils'

const mockRunnerRun = vi.hoisted(() => vi.fn())
const mockTrackLlmRuns = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))
const mockAgent = vi.hoisted(() =>
  vi.fn(function AgentMock(config: Record<string, unknown>) {
    return {
      name: config.name,
      instructions: config.instructions,
      outputType: config.outputType,
      model: config.model,
      modelSettings: config.modelSettings,
    }
  })
)
const mockRunner = vi.hoisted(() =>
  vi.fn(function RunnerMock(_config: Record<string, unknown>) {
    return {
      run: mockRunnerRun,
    }
  })
)

// Mock OpenAI Agent and Runner
vi.mock('@openai/agents', () => ({
  Agent: mockAgent,
  Runner: mockRunner,
}))

vi.mock('../../src/services/hubtype-api-client', () => ({
  HubtypeApiClient: vi.fn().mockImplementation(function HubtypeApiClientMock() {
    return {
      trackLlmRuns: mockTrackLlmRuns,
    }
  }),
}))

const mockConstants = vi.hoisted(() => ({
  isProd: false,
  OPENAI_PROVIDER: 'azure',
  AZURE_OPENAI_API_VERSION: '2025-01-01-preview',
  LLM_PROVIDERS: { AZURE: 'azure', OPENAI: 'openai', LITELLM: 'litellm' },
}))

let createInputGuardrails: typeof import('../../src/guardrails/input').createInputGuardrails
async function loadGuardrails(isProd: boolean) {
  vi.resetModules()
  vi.doMock('../../src/constants', () => ({ ...mockConstants, isProd }))
  ;({ createInputGuardrails } = await import('../../src/guardrails/input'))
}

describe('createInputGuardrails', () => {
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
    add: vi.fn(),
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

  const mockAgentInstance = new Agent({
    name: 'TestAgent',
    instructions: 'Test instructions',
    outputType: undefined,
  })

  const mockLlmConfig = {
    modelName: 'gpt-4.1-mini',
    modelSettings: {
      temperature: 0,
      text: { verbosity: 'medium' },
      toolChoice: 'retrieve_knowledge',
    },
    modelProvider: {},
    getModel: vi.fn().mockResolvedValue({ id: 'guardrail-model' }),
    getApiVersion: vi.fn().mockReturnValue('test-api-version'),
    getProviderName: vi.fn().mockReturnValue('azure'),
  } as unknown as LLMConfig

  const mockTrackingContext: GuardrailTrackingContext = {
    botId: 'test-bot-id',
    isTest: false,
    authToken: 'test-token',
    inferenceId: 'test-inference-id',
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    await loadGuardrails(false)
  })

  it('should create a guardrail with the correct configuration', async () => {
    const [guardrail] = await createInputGuardrails(
      mockRules,
      mockLlmConfig,
      mockTrackingContext
    )

    expect(guardrail.name).toBe('InputGuardrail')
    expect(mockAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'InputGuardrail',
        model: { id: 'guardrail-model' },
        instructions:
          'Check if the user triggers some of the following guardrails.',
        outputType: expect.any(Object),
        modelSettings: expect.objectContaining({
          temperature: 0,
          text: { verbosity: 'medium' },
          toolChoice: undefined,
        }),
      })
    )
  })

  it('should return no guardrails when no rules are configured', async () => {
    const guardrails = await createInputGuardrails(
      [],
      mockLlmConfig,
      mockTrackingContext
    )

    expect(guardrails).toEqual([])
    expect(Agent).not.toHaveBeenCalled()
  })

  it('should return triggered guardrails when rules are violated', async () => {
    const mockAgentOutput = {
      finalOutput: {
        is_offensive: true,
        is_spam: false,
      },
    }
    mockRunnerRun.mockResolvedValue(mockAgentOutput)

    const [guardrail] = await createInputGuardrails(
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
      agent: mockAgentInstance,
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
    expect(mockRunner).toHaveBeenCalledWith({ tracingDisabled: true })
    const runnerConfig = getLastMockCallArg<Record<string, unknown>>(mockRunner)
    expect(runnerConfig).not.toHaveProperty('modelSettings')
    expect(runnerConfig).not.toHaveProperty('modelProvider')
  })

  it('should return no triggered guardrails when no rules are violated', async () => {
    const mockAgentOutput = {
      finalOutput: {
        is_offensive: false,
        is_spam: false,
      },
    }
    mockRunnerRun.mockResolvedValue(mockAgentOutput)

    const [guardrail] = await createInputGuardrails(
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
      agent: mockAgentInstance,
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

    const [guardrail] = await createInputGuardrails(
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
        agent: mockAgentInstance,
      })
    ).rejects.toThrow('Guardrail agent failed to produce output')
  })

  it('should call trackLlmRuns after guardrail execution in production', async () => {
    await loadGuardrails(true)
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

    const [guardrail] = await createInputGuardrails(
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
      agent: mockAgentInstance,
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
