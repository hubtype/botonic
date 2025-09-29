import { Agent, run, RunContext, Usage } from '@openai/agents'

import { createInputGuardrail } from '../../src/guardrails/input'
import { GuardrailRule } from '../../src/types'

// Mock OpenAI Agent and run function
jest.mock('@openai/agents', () => ({
  Agent: jest.fn().mockImplementation(config => ({
    name: config.name,
    instructions: config.instructions,
    outputType: config.outputType,
  })),
  run: jest.fn(),
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

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a guardrail with the correct configuration', () => {
    const guardrail = createInputGuardrail(mockRules)

    expect(guardrail.name).toBe('InputGuardrail')
    expect(Agent).toHaveBeenCalledWith({
      name: 'InputGuardrail',
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
    ;(run as jest.Mock).mockResolvedValue(mockAgentOutput)

    const guardrail = createInputGuardrail(mockRules)
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
    expect(run).toHaveBeenCalledWith(
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
    ;(run as jest.Mock).mockResolvedValue(mockAgentOutput)

    const guardrail = createInputGuardrail(mockRules)
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
    ;(run as jest.Mock).mockResolvedValue(mockAgentOutput)

    const guardrail = createInputGuardrail(mockRules)
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
})
