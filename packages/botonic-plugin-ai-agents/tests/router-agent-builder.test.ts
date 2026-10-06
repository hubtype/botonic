import type { AgentOutputType, Handoff, ModelSettings } from '@openai/agents'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { GuardrailTrackingContext } from '../src/guardrails/input'
import type { LLMConfig } from '../src/llm-config'
import type { OutputSchema } from '../src/structured-output'
import type { Context, GuardrailRule } from '../src/types'
import { getLastMockCallArg } from './helpers/mock-utils'

type MockAgentConfig = {
  name: string
  instructions?: string
  model?: unknown
  modelSettings?: ModelSettings
  outputType?: unknown
  handoffs?: unknown
  inputGuardrails?: { name: string }[]
}

const mockAgentCreate = vi.hoisted(() =>
  vi.fn((config: MockAgentConfig) => config)
)

vi.mock('@openai/agents', () => ({
  Agent: {
    create: mockAgentCreate,
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
    expect(agent).toBe(mockAgentCreate.mock.results[0].value)
    expect(mockAgentCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Router Agent',
        model: mockResolvedModel,
        handoffs,
        inputGuardrails: mockInputGuardrails,
        outputType: expect.any(Object),
        instructions: expect.stringContaining(
          'Route the conversation to the right worker'
        ),
      })
    )
    expect(
      getLastMockCallArg<MockAgentConfig>(mockAgentCreate).instructions
    ).toContain('<output>')
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

    const agentConfig = getLastMockCallArg<MockAgentConfig>(mockAgentCreate)
    expect(agentConfig.modelSettings).toEqual(mockModelSettings)
    expect(agentConfig.modelSettings).not.toBe(mockModelSettings)
    expect(agentConfig.modelSettings?.reasoning).not.toBe(
      mockModelSettings.reasoning
    )
    expect(agentConfig.modelSettings?.text).not.toBe(mockModelSettings.text)
  })
})
