import { AiAgentArgs, BotContext, INPUT, PROVIDER } from '@botonic/core'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'

import BotonicPluginAiAgents from '../src/index'

// Store the captured AIAgentBuilder arguments
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let capturedBuilderArgs: any = null

// Mock setUpOpenAI to avoid actual OpenAI setup
jest.mock('../src/openai', () => ({
  setUpOpenAI: jest.fn(),
}))

// Mock AIAgentBuilder to capture the arguments it receives
jest.mock('../src/agent-builder', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AIAgentBuilder: jest.fn().mockImplementation((args: any) => {
    capturedBuilderArgs = args
    return {
      build: jest.fn().mockReturnValue({
        name: args.name,
        instructions: args.instructions,
        tools: args.tools || [],
      }),
    }
  }),
}))

// Mock AIAgentRunner to avoid actual execution
jest.mock('../src/runner', () => ({
  AIAgentRunner: jest.fn().mockImplementation(() => ({
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
jest.mock('../src/hubtype-api-client', () => ({
  HubtypeApiClient: jest.fn().mockImplementation(() => ({
    getMessages: jest.fn().mockResolvedValue([] as never),
    getLocalMessages: jest.fn().mockResolvedValue([] as never),
  })),
}))

describe('BotonicPluginAiAgents - Campaign Context Integration', () => {
  const createMockRequest = (campaign_v2?: {
    id: string
    name: string
    agent_context?: string
  }): BotContext => ({
    session: {
      is_first_interaction: false,
      organization: 'test-org',
      organization_id: 'org-123',
      bot: { id: 'bot-123' },
      user: {
        id: 'user-123',
        provider: PROVIDER.WEBCHAT,
        locale: 'en',
        country: 'US',
        system_locale: 'en',
        contact_info: { email: 'test@test.com' },
        extra_data: {},
      },
      _access_token: 'test-token',
      _hubtype_api: 'https://api.hubtype.com',
      is_test_integration: false,
      flow_thread_id: 'flow-123',
      __retries: 0,
    },
    input: {
      type: INPUT.TEXT,
      data: 'Hello',
      bot_interaction_id: 'interaction-123',
      message_id: 'msg-123',
      context: campaign_v2 ? { campaign_v2 } : undefined,
    },
    lastRoutePath: '',
    params: {},
    defaultDelay: 0,
    defaultTyping: 0,
    plugins: {},
    getUserCountry: () => 'US',
    getUserLocale: () => 'en',
    getSystemLocale: () => 'en',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setUserCountry: jest.fn() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setUserLocale: jest.fn() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSystemLocale: jest.fn() as any,
  })

  const mockAiAgentArgs: AiAgentArgs = {
    name: 'Test Agent',
    instructions: 'Test instructions',
    activeTools: [],
    sourceIds: [],
    inputGuardrailRules: [],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    capturedBuilderArgs = null
    // Set NODE_ENV to non-production to use authToken from options
    process.env.NODE_ENV = 'test'
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should pass campaign_v2 to AIAgentBuilder when present in input.context', async () => {
    const campaignContext = {
      id: 'campaign-123',
      name: 'Test Campaign',
      agent_context: 'Additional context for the agent',
    }

    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest(campaignContext)
    await plugin.getInference(request, mockAiAgentArgs)

    expect(capturedBuilderArgs).toBeDefined()
    expect(capturedBuilderArgs.campaignContext).toEqual(campaignContext)
  })

  it('should pass undefined campaignContext when campaign_v2 is not in input.context', async () => {
    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest(undefined)
    await plugin.getInference(request, mockAiAgentArgs)

    expect(capturedBuilderArgs).toBeDefined()
    expect(capturedBuilderArgs.campaignContext).toBeUndefined()
  })

  it('should pass undefined campaignContext when input.context is undefined', async () => {
    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest()
    // Explicitly set context to undefined
    request.input.context = undefined

    await plugin.getInference(request, mockAiAgentArgs)

    expect(capturedBuilderArgs).toBeDefined()
    expect(capturedBuilderArgs.campaignContext).toBeUndefined()
  })

  it('should pass campaign_v2 without agent_context', async () => {
    const campaignWithoutAgentContext = {
      id: 'campaign-456',
      name: 'Campaign without agent context',
      // No agent_context field
    }

    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest(campaignWithoutAgentContext)
    await plugin.getInference(request, mockAiAgentArgs)

    expect(capturedBuilderArgs).toBeDefined()
    expect(capturedBuilderArgs.campaignContext).toEqual(
      campaignWithoutAgentContext
    )
    expect(capturedBuilderArgs.campaignContext.agent_context).toBeUndefined()
  })

  it('should pass campaign_v2 with empty agent_context', async () => {
    const campaignWithEmptyAgentContext = {
      id: 'campaign-789',
      name: 'Campaign with empty agent context',
      agent_context: '',
    }

    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest(campaignWithEmptyAgentContext)
    await plugin.getInference(request, mockAiAgentArgs)

    expect(capturedBuilderArgs).toBeDefined()
    expect(capturedBuilderArgs.campaignContext).toEqual(
      campaignWithEmptyAgentContext
    )
    expect(capturedBuilderArgs.campaignContext.agent_context).toBe('')
  })

  it('should pass correct name, instructions and sourceIds from aiAgentArgs', async () => {
    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest()
    const customAiAgentArgs: AiAgentArgs = {
      name: 'Custom Agent',
      instructions: 'Custom instructions for the agent',
      activeTools: [],
      sourceIds: ['source-1', 'source-2'],
      inputGuardrailRules: [
        { name: 'is_offensive', description: 'Check for offensive content' },
      ],
    }

    await plugin.getInference(request, customAiAgentArgs)

    expect(capturedBuilderArgs).toBeDefined()
    expect(capturedBuilderArgs.name).toBe('Custom Agent')
    expect(capturedBuilderArgs.instructions).toBe(
      'Custom instructions for the agent'
    )
    expect(capturedBuilderArgs.sourceIds).toEqual(['source-1', 'source-2'])
    expect(capturedBuilderArgs.inputGuardrailRules).toEqual([
      { name: 'is_offensive', description: 'Check for offensive content' },
    ])
  })

  it('should pass contact_info from session.user', async () => {
    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest()
    request.session.user.contact_info = {
      email: 'user@example.com',
      phone: '+1234567890',
    }

    await plugin.getInference(request, mockAiAgentArgs)

    expect(capturedBuilderArgs).toBeDefined()
    expect(capturedBuilderArgs.contactInfo).toEqual({
      email: 'user@example.com',
      phone: '+1234567890',
    })
  })

  it('should pass empty object for contactInfo when contact_info is undefined', async () => {
    const plugin = new BotonicPluginAiAgents({
      authToken: 'test-auth-token',
    })

    const request = createMockRequest()
    request.session.user.contact_info = undefined

    await plugin.getInference(request, mockAiAgentArgs)

    expect(capturedBuilderArgs).toBeDefined()
    expect(capturedBuilderArgs.contactInfo).toEqual({})
  })
})
