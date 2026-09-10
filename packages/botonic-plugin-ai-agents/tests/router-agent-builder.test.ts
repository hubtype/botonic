import type { AgentOutputType, Handoff, ModelSettings } from '@openai/agents'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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

const capturedAgentConfig = vi.hoisted(() => ({
  value: null as MockAgentConfig | null,
}))

vi.mock('@openai/agents', () => ({
  Agent: {
    create: vi.fn((config: MockAgentConfig) => {
      capturedAgentConfig.value = config
      return config
    }),
  },
}))

const mockResolvedModel = vi.hoisted(() => ({ id: 'resolved-gpt-4.1-mini' }))
const mockModelSettings: ModelSettings = {
  temperature: 1,
  reasoning: { effort: 'none' },
  text: { verbosity: 'medium' },
}
const mockLlmConfig = {
  modelName: 'gpt-4.1-mini',
  modelSettings: mockModelSettings,
  modelProvider: {},
  getModel: vi.fn().mockResolvedValue(mockResolvedModel),
} as unknown as LLMConfig

const mockInputGuardrails = vi.hoisted(() => [{ name: 'InputGuardrail' }])
const mockCreateInputGuardrails = vi.hoisted(() =>
  vi.fn().mockResolvedValue(mockInputGuardrails as never)
)

vi.mock('../src/guardrails', () => ({
  createInputGuardrails: mockCreateInputGuardrails,
}))

import { RouterAgent } from '../src/agents/router-agent'

describe('RouterAgent', () => {
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
    vi.clearAllMocks()
    capturedAgentConfig.value = null
  })

  it('should build a router agent with handoffs, guardrails and structured output', async () => {
    const routerAgent = await RouterAgent.create({
      name: 'Router Agent',
      instructions: 'Route the conversation to the right worker',
      llmConfig: mockLlmConfig,
      handoffs,
      inputGuardrailRules,
      outputMessagesSchemas: [],
      guardrailTrackingContext,
    })

    const agent = routerAgent.getAgent()

    expect(mockCreateInputGuardrails).toHaveBeenCalledWith(
      inputGuardrailRules,
      mockLlmConfig,
      guardrailTrackingContext
    )
    expect(agent).toBe(capturedAgentConfig.value)

    const agentConfig = capturedAgentConfig.value
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
    await RouterAgent.create({
      name: 'Router Agent',
      instructions: 'Route the conversation to the right worker',
      llmConfig: mockLlmConfig,
      handoffs,
      inputGuardrailRules: [],
      outputMessagesSchemas: [customMessageSchema],
      guardrailTrackingContext,
    })

    const outputType = capturedAgentConfig.value?.outputType
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
    await RouterAgent.create({
      name: 'Router Agent',
      instructions: 'Route the conversation to the right worker',
      llmConfig: mockLlmConfig,
      handoffs,
      inputGuardrailRules: [],
      outputMessagesSchemas: [],
      guardrailTrackingContext,
    })

    expect(capturedAgentConfig.value?.modelSettings).toEqual(mockModelSettings)
    expect(capturedAgentConfig.value?.modelSettings).not.toBe(mockModelSettings)
    expect(capturedAgentConfig.value?.modelSettings?.reasoning).not.toBe(
      mockModelSettings.reasoning
    )
    expect(capturedAgentConfig.value?.modelSettings?.text).not.toBe(
      mockModelSettings.text
    )
  })
})
