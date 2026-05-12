import type { AgentOutputType, Handoff, ModelSettings } from '@openai/agents'
import { z } from 'zod'

import type { GuardrailTrackingContext } from '../src/guardrails/input'
import type { LLMConfig } from '../src/llm-config'
import type { OutputSchema } from '../src/structured-output'
import type { Context, GuardrailRule } from '../src/types'

type MockOutputType = {
  safeParse: (value: unknown) => { success: boolean }
}
type MockAgentConfig = {
  name: string
  instructions?: string
  model?: unknown
  modelSettings?: ModelSettings
  outputType?: MockOutputType
  handoffs?: unknown
  inputGuardrails?: { name: string }[]
}

let capturedAgentConfig: MockAgentConfig | null = null

jest.mock('@openai/agents', () => ({
  Agent: {
    create: jest.fn((config: MockAgentConfig) => {
      capturedAgentConfig = config
      return config
    }),
  },
}))

const mockResolvedModel = { id: 'resolved-gpt-4.1-mini' }
const mockModelSettings: ModelSettings = {
  temperature: 1,
  reasoning: { effort: 'none' },
  text: { verbosity: 'medium' },
}
const mockLlmConfig = {
  modelName: 'gpt-4.1-mini',
  modelSettings: mockModelSettings,
  modelProvider: {},
  getModel: jest.fn().mockResolvedValue(mockResolvedModel),
} as unknown as LLMConfig

const mockInputGuardrails = [{ name: 'InputGuardrail' }]
const mockCreateInputGuardrails = jest
  .fn()
  .mockResolvedValue(mockInputGuardrails as never)

jest.mock('../src/guardrails', () => ({
  createInputGuardrails: mockCreateInputGuardrails,
}))

import { AIAgentRouterBuilder } from '../src/agent-router-builder'

describe('AIAgentRouterBuilder', () => {
  const handoffs = [{ agentName: 'Support Worker' }] as unknown as Handoff<
    Context,
    AgentOutputType<typeof OutputSchema>
  >[]
  const inputGuardrailRules: GuardrailRule[] = [
    { name: 'is_offensive', description: 'Check for offensive content' },
  ]
  const guardrailTrackingContext: GuardrailTrackingContext = {
    botId: 'test-bot-id',
    isTest: false,
    authToken: 'test-auth-token',
    inferenceId: 'test-inference-id',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    capturedAgentConfig = null
  })

  it('should build a router agent with handoffs, guardrails and structured output', async () => {
    const builder = new AIAgentRouterBuilder({
      name: 'Router Agent',
      instructions: 'Route the conversation to the right worker',
      llmConfig: mockLlmConfig,
      handoffs,
      inputGuardrailRules,
      outputMessagesSchemas: [],
      guardrailTrackingContext,
    })

    const agent = await builder.build()

    expect(mockCreateInputGuardrails).toHaveBeenCalledWith(
      inputGuardrailRules,
      mockLlmConfig,
      guardrailTrackingContext
    )
    expect(agent).toBe(capturedAgentConfig)

    const agentConfig = capturedAgentConfig
    if (!agentConfig?.outputType) {
      throw new Error('Router agent was not created with outputType')
    }

    expect(agentConfig.name).toBe('Router Agent')
    expect(agentConfig.model).toBe(mockResolvedModel)
    expect(agentConfig.handoffs).toBe(handoffs)
    expect(agentConfig.inputGuardrails).toBe(mockInputGuardrails)
    expect(agentConfig.instructions).toContain(
      'Route the conversation to the right worker'
    )
    expect(agentConfig.instructions).toContain('<output>')
    expect(
      agentConfig.outputType.safeParse({
        messages: [{ type: 'text', content: { text: 'Hi' } }],
      }).success
    ).toBe(true)
  })

  it('should include external output message schemas in the router output type', async () => {
    const customMessageSchema = z.object({
      type: z.literal('custom'),
      content: z.object({ value: z.string() }),
    })
    const builder = new AIAgentRouterBuilder({
      name: 'Router Agent',
      instructions: 'Route the conversation to the right worker',
      llmConfig: mockLlmConfig,
      handoffs,
      inputGuardrailRules: [],
      outputMessagesSchemas: [customMessageSchema],
      guardrailTrackingContext,
    })

    await builder.build()

    const outputType = capturedAgentConfig?.outputType
    if (!outputType) {
      throw new Error('Router agent was not created with outputType')
    }

    expect(
      outputType.safeParse({
        messages: [{ type: 'custom', content: { value: 'extra' } }],
      }).success
    ).toBe(true)
  })

  it('should copy nested router model settings before passing them to the agent', async () => {
    const builder = new AIAgentRouterBuilder({
      name: 'Router Agent',
      instructions: 'Route the conversation to the right worker',
      llmConfig: mockLlmConfig,
      handoffs,
      inputGuardrailRules: [],
      outputMessagesSchemas: [],
      guardrailTrackingContext,
    })

    await builder.build()

    expect(capturedAgentConfig?.modelSettings).toEqual(mockModelSettings)
    expect(capturedAgentConfig?.modelSettings).not.toBe(mockModelSettings)
    expect(capturedAgentConfig?.modelSettings?.reasoning).not.toBe(
      mockModelSettings.reasoning
    )
    expect(capturedAgentConfig?.modelSettings?.text).not.toBe(
      mockModelSettings.text
    )
  })
})
