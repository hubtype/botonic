import {
  type AIAgentRouterArgs,
  type AiAgentArgs,
  AiAgentType,
  type BotContext,
  INPUT,
  PROVIDER,
  VerbosityLevel,
} from '@botonic/core'
import { createTestBotContext } from '@botonic/core/testing'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'

import BotonicPluginAiAgents from '../src/index'
import { LLMConfig as MockedLLMConfig } from '../src/llm-config'

// Store the captured WorkerAgent arguments
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let capturedWorkerAgentArgs: any = null
type MockLlmConfig = {
  modelName: string
  modelSettings: { temperature: number }
  modelProvider: Record<string, never>
  getModel: () => Promise<{ id: string }>
}
type MockRouterAgentArgs = {
  name: string
  instructions: string
  llmConfig: MockLlmConfig
  handoffs: unknown[]
  inputGuardrailRules: unknown[]
  outputMessagesSchemas: unknown[]
  guardrailTrackingContext: unknown
}
let capturedRouterAgentArgs: MockRouterAgentArgs | null = null
type MockAgentConfig = {
  name: string
  instructions?: string
  model?: unknown
  modelSettings?: unknown
  handoffs?: unknown
  inputGuardrails?: { name: string }[]
}
type MockAgentInstance = MockAgentConfig

jest.mock('@openai/agents', () => {
  const create = jest.fn((config: MockAgentConfig): MockAgentInstance => {
    return {
      name: config.name,
      instructions: config.instructions,
      model: config.model,
      modelSettings: config.modelSettings,
      handoffs: config.handoffs,
      inputGuardrails: config.inputGuardrails,
    }
  })
  const AgentMock = Object.assign(
    jest.fn(
      (config: MockAgentConfig): MockAgentInstance => ({
        name: config.name,
        instructions: config.instructions,
        model: config.model,
        modelSettings: config.modelSettings,
      })
    ),
    { create }
  )

  return {
    Agent: AgentMock,
    handoff: jest.fn().mockImplementation(agent => ({ agent })),
    setTracingDisabled: jest.fn(),
    tool: jest.fn().mockImplementation(config => config),
  }
})

// Mock LLMConfig to avoid actual OpenAI/Azure setup
jest.mock('../src/llm-config', () => ({
  LLMConfig: jest.fn().mockImplementation((_maxRetries, _timeout, model) => ({
    modelName: model,
    modelSettings: { temperature: 0 },
    modelProvider: {},
    getModel: jest.fn(async () => ({ id: `resolved-${model}` })),
  })),
}))

// Mock WorkerAgent to capture the arguments it receives
jest.mock('../src/agents/worker-agent', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  WorkerAgent: {
    create: jest.fn(async (args: any) => {
      capturedWorkerAgentArgs = args
      return {
        getAgent: jest.fn(() => ({
          name: args.name,
          instructions: args.instructions,
          model: { id: `resolved-${args.llmConfig.modelName}` },
          modelSettings: args.llmConfig.modelSettings,
          tools: args.tools || [],
        })),
      }
    }),
  },
}))

jest.mock('../src/agents/router-agent', () => ({
  RouterAgent: {
    create: jest.fn(async (args: unknown) => {
      const routerAgentArgs = args as MockRouterAgentArgs
      capturedRouterAgentArgs = routerAgentArgs
      return {
        getAgent: jest.fn(() => ({
          name: routerAgentArgs.name,
          instructions: routerAgentArgs.instructions,
          modelSettings: routerAgentArgs.llmConfig.modelSettings,
          handoffs: routerAgentArgs.handoffs,
        })),
      }
    }),
  },
}))

// Mock WorkerAgentRunner to avoid actual execution
jest.mock('../src/runners/worker-runner', () => ({
  WorkerRunner: jest.fn().mockImplementation(() => ({
    run: jest.fn().mockResolvedValue({
      messages: [],
      toolsExecuted: [],
      memoryLength: 0,
      exit: false,
      error: false,
      inputGuardrailsTriggered: [],
      outputGuardrailsTriggered: [],
    } as never),
  })),
}))

jest.mock('../src/runners/router-runner', () => ({
  RouterRunner: jest.fn().mockImplementation(() => ({
    run: jest.fn().mockResolvedValue({
      messages: [],
      toolsExecuted: [],
      memoryLength: 0,
      exit: false,
      error: false,
      inputGuardrailsTriggered: [],
      outputGuardrailsTriggered: [],
    } as never),
  })),
}))

// Mock HubtypeApiClient to avoid actual API calls
jest.mock('../src/services/hubtype-api-client', () => ({
  HubtypeApiClient: jest.fn().mockImplementation(() => ({
    getMessages: jest.fn().mockResolvedValue([] as never),
    getLocalMessages: jest.fn().mockResolvedValue([] as never),
  })),
}))

describe('BotonicPluginAiAgents - Campaign Context Integration', () => {
  const createMockRequest = (
    campaigns_v2?: {
      id: string
      name: string
      agent_context?: string
    }[]
  ): BotContext =>
    createTestBotContext({
      session: {
        organization: 'test-org',
        organizationId: 'org-123',
        botId: 'bot-123',
        user: {
          id: 'user-123',
          provider: PROVIDER.WEBCHAT,
          locale: 'en',
          country: 'US',
          contactInfo: [
            {
              name: 'email',
              value: 'test@test.com',
              type: 'string',
              description: 'User email',
            },
          ],
        },
        accessToken: 'test-token',
        flowThreadId: 'flow-123',
      },
      input: {
        type: INPUT.TEXT,
        data: 'Hello',
        botInteractionId: 'interaction-123',
        messageId: 'msg-123',
        context: campaigns_v2 ? { campaigns_v2 } : undefined,
      },
    })

  const mockAiAgentArgs: AiAgentArgs = {
    type: AiAgentType.Worker,
    name: 'Test Agent',
    instructions: 'Test instructions',
    model: 'gpt-4.1-mini',
    verbosity: VerbosityLevel.Medium,
    activeTools: [],
    sourceIds: [],
    inputGuardrailRules: [],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    capturedWorkerAgentArgs = null
    capturedRouterAgentArgs = null
    // Set NODE_ENV to non-production to use authToken from options
    process.env.NODE_ENV = 'test'
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should pass campaigns_v2 to WorkerAgent when present in input.context', async () => {
    const campaignsContext = [
      {
        id: 'campaign-123',
        name: 'Test Campaign',
        agent_context: 'Additional context for the agent',
      },
    ]

    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest(campaignsContext)
    await plugin.getInference(request, mockAiAgentArgs)

    expect(capturedWorkerAgentArgs).toBeDefined()
    expect(capturedWorkerAgentArgs.campaignsContext).toEqual(campaignsContext)
  })

  it('should pass undefined campaignsContext when campaigns_v2 is not in input.context', async () => {
    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest(undefined)
    await plugin.getInference(request, mockAiAgentArgs)

    expect(capturedWorkerAgentArgs).toBeDefined()
    expect(capturedWorkerAgentArgs.campaignsContext).toBeUndefined()
  })

  it('should pass undefined campaignsContext when input.context is undefined', async () => {
    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest()
    // Explicitly set context to undefined
    request.input.context = undefined

    await plugin.getInference(request, mockAiAgentArgs)

    expect(capturedWorkerAgentArgs).toBeDefined()
    expect(capturedWorkerAgentArgs.campaignsContext).toBeUndefined()
  })

  it('should pass campaigns_v2 without agent_context', async () => {
    const campaignWithoutAgentContext = [
      {
        id: 'campaign-456',
        name: 'Campaign without agent context',
        // No agent_context field
      },
    ]

    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest(campaignWithoutAgentContext)
    await plugin.getInference(request, mockAiAgentArgs)

    expect(capturedWorkerAgentArgs).toBeDefined()
    expect(capturedWorkerAgentArgs.campaignsContext).toEqual(
      campaignWithoutAgentContext
    )
    expect(
      capturedWorkerAgentArgs.campaignsContext[0].agent_context
    ).toBeUndefined()
  })

  it('should pass campaigns_v2 with empty agent_context', async () => {
    const campaignWithEmptyAgentContext = [
      {
        id: 'campaign-789',
        name: 'Campaign with empty agent context',
        agent_context: '',
      },
    ]

    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest(campaignWithEmptyAgentContext)
    await plugin.getInference(request, mockAiAgentArgs)

    expect(capturedWorkerAgentArgs).toBeDefined()
    expect(capturedWorkerAgentArgs.campaignsContext).toEqual(
      campaignWithEmptyAgentContext
    )
    expect(capturedWorkerAgentArgs.campaignsContext[0].agent_context).toBe('')
  })

  it('should pass correct name, instructions and sourceIds from aiAgentArgs', async () => {
    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest()
    const customAiAgentArgs: AiAgentArgs = {
      type: AiAgentType.Worker,
      name: 'Custom Agent',
      instructions: 'Custom instructions for the agent',
      model: 'gpt-4.1-mini',
      verbosity: VerbosityLevel.Medium,
      activeTools: [],
      sourceIds: ['source-1', 'source-2'],
      inputGuardrailRules: [
        { name: 'is_offensive', description: 'Check for offensive content' },
      ],
    }

    await plugin.getInference(request, customAiAgentArgs)

    expect(capturedWorkerAgentArgs).toBeDefined()
    expect(capturedWorkerAgentArgs.name).toBe('Custom Agent')
    expect(capturedWorkerAgentArgs.instructions).toBe(
      'Custom instructions for the agent'
    )
    expect(capturedWorkerAgentArgs.sourceIds).toEqual(['source-1', 'source-2'])
    expect(capturedWorkerAgentArgs.inputGuardrailRules).toEqual([
      { name: 'is_offensive', description: 'Check for offensive content' },
    ])
  })

  it('should pass router configuration to RouterAgent', async () => {
    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest()
    const routerArgs: AIAgentRouterArgs = {
      type: AiAgentType.Router,
      name: 'Router Agent',
      instructions: 'Route the conversation to the right worker',
      model: 'gpt-4.1-mini',
      verbosity: VerbosityLevel.High,
      inputGuardrailRules: [
        {
          name: 'is_offensive',
          description: 'Check for offensive content',
        },
      ],
      agents: [
        {
          type: AiAgentType.Worker,
          name: 'Support Worker',
          description: 'Handles support questions',
          instructions: 'Answer support questions',
          model: 'gpt-4.1-mini',
          verbosity: VerbosityLevel.Medium,
          activeTools: [],
          sourceIds: [],
          inputGuardrailRules: [],
        },
      ],
    }

    await plugin.getInference(request, routerArgs)

    const routerAgentArgs = capturedRouterAgentArgs
    if (!routerAgentArgs) {
      throw new Error('Router builder was not created')
    }
    expect(routerAgentArgs.name).toBe('Router Agent')
    expect(routerAgentArgs.instructions).toBe(
      'Route the conversation to the right worker'
    )
    expect(routerAgentArgs.llmConfig).toMatchObject({
      modelName: 'gpt-4.1-mini',
      modelSettings: { temperature: 0 },
    })
    expect(MockedLLMConfig).toHaveBeenCalledWith(
      2,
      16000,
      'gpt-4.1-mini',
      VerbosityLevel.High,
      expect.objectContaining({
        settings: expect.objectContaining({
          LITELLM_API_URL: expect.any(String),
        }),
        secrets: expect.objectContaining({
          LITELLM_API_KEY: expect.any(String),
        }),
        session: expect.objectContaining({
          bot: expect.objectContaining({ id: 'bot-123' }),
          organization_id: 'org-123',
        }),
      })
    )
    expect(routerAgentArgs.inputGuardrailRules).toEqual([
      {
        name: 'is_offensive',
        description: 'Check for offensive content',
      },
    ])
    expect(routerAgentArgs.outputMessagesSchemas).toEqual([])
    expect(routerAgentArgs.guardrailTrackingContext).toEqual({
      botId: 'bot-123',
      isTest: false,
      authToken: 'test-auth-token',
      inferenceId: expect.any(String),
    })
    expect(routerAgentArgs.handoffs).toEqual([
      expect.objectContaining({
        agent: expect.objectContaining({
          name: 'Support Worker',
        }),
      }),
    ])
  })

  it('should pass router worker sourceIds to the handoff agent builder', async () => {
    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest()
    const routerArgs: AIAgentRouterArgs = {
      type: AiAgentType.Router,
      name: 'Router Agent',
      instructions: 'Route the conversation to the right worker',
      model: 'gpt-4.1-mini',
      verbosity: VerbosityLevel.Medium,
      agents: [
        {
          type: AiAgentType.Worker,
          name: 'Knowledge Worker',
          description: 'Handles knowledge questions',
          instructions: 'Answer with knowledge sources',
          model: 'gpt-4.1-mini',
          verbosity: VerbosityLevel.Medium,
          activeTools: [],
          sourceIds: ['source-1', 'source-2'],
          inputGuardrailRules: [],
        },
      ],
    }

    await plugin.getInference(request, routerArgs)

    expect(capturedWorkerAgentArgs).toBeDefined()
    expect(capturedWorkerAgentArgs.name).toBe('Knowledge Worker')
    expect(capturedWorkerAgentArgs.sourceIds).toEqual(['source-1', 'source-2'])
    expect(capturedRouterAgentArgs?.handoffs).toEqual([
      expect.objectContaining({
        agent: expect.objectContaining({
          name: 'Knowledge Worker',
        }),
      }),
    ])
  })

  it('should pass contact_info from session.user', async () => {
    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest()
    request.session.user.contact_info = [
      {
        name: 'email',
        value: 'user@example.com',
        type: 'string',
        description: 'User email',
      },
      {
        name: 'phone',
        value: '+1234567890',
        type: 'string',
        description: 'User phone',
      },
    ]

    await plugin.getInference(request, mockAiAgentArgs)

    expect(capturedWorkerAgentArgs).toBeDefined()
    expect(capturedWorkerAgentArgs.contactInfo).toEqual([
      {
        name: 'email',
        value: 'user@example.com',
        type: 'string',
        description: 'User email',
      },
      {
        name: 'phone',
        value: '+1234567890',
        type: 'string',
        description: 'User phone',
      },
    ])
  })

  it('should pass empty object for contactInfo when contact_info is undefined', async () => {
    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest()
    request.session.user.contact_info = undefined

    await plugin.getInference(request, mockAiAgentArgs)

    expect(capturedWorkerAgentArgs).toBeDefined()
    expect(capturedWorkerAgentArgs.contactInfo).toEqual([])
  })
})
