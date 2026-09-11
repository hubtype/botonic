import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import type { DebugLogger } from '../src/debug-logger'
import type { GuardrailRule, Tool } from '../src/types'

// Create a mock disabled logger for tests (no-op implementations)
const mockLogger: DebugLogger = {
  logInitialConfig: vi.fn(),
  logAgentDebugInfo: vi.fn(),
  logModelSettings: vi.fn(),
  logRunnerStart: vi.fn(),
  logRunResult: vi.fn(),
  logGuardrailTriggered: vi.fn(),
  logRunnerError: vi.fn(),
  logToolExecution: vi.fn(),
}

const mockAgent = vi.hoisted(() =>
  vi.fn(function AgentMock(config: Record<string, unknown>) {
    return {
      name: config.name,
      instructions: config.instructions,
      tools: config.tools,
      contactInfo: config.contactInfo,
      model: config.model,
      modelSettings: config.modelSettings,
    }
  })
)

vi.mock('@openai/agents', () => ({
  Agent: mockAgent,
}))

vi.mock('../src/tools', () => ({
  createRetrieveKnowledge: vi.fn((sourceIds: string[]) => ({
    name: 'retrieve_knowledge',
    description: 'Consult the knowledge base for information before answering.',
    sourceIds,
  })),
  mandatoryTools: [],
  RETRIEVE_KNOWLEDGE_TOOL_NAME: 'retrieve_knowledge',
}))

// Mock constants - can be overridden per test
const mockConstants = vi.hoisted(() => ({
  LLM_PROVIDERS: { OPENAI: 'openai', AZURE: 'azure' },
  LLM_PROVIDER: 'azure' as 'openai' | 'azure',
  LLM_OPENAI_MODEL: 'gpt-4.1-mini',
}))

vi.mock('../src/constants', () => mockConstants)

// Import after mocks are set up
import type { ContactInfo } from '@botonic/core'
import { SpecialistAgent } from '../src/agents/specialist-agent'
import type { GuardrailTrackingContext } from '../src/guardrails/input'
import type { LLMConfig } from '../src/llm-config'

const mockGuardrailTrackingContext: GuardrailTrackingContext = {
  botId: 'test-bot-id',
  isTest: false,
  authToken: 'test-token',
  inferenceId: 'test-inference-id',
}

const toCompactContactJson = (contactInfo: ContactInfo[]) =>
  JSON.stringify(contactInfo.map(({ name, value }) => ({ name, value })))

// Mock LLMConfig for tests (agents uses modelName and modelSettings for logging)
const resolvedModel = { id: 'resolved-model' }
const mockLlmConfig = {
  modelName: 'gpt-4.1-mini',
  modelSettings: {
    reasoning: { effort: 'none' as const },
    text: { verbosity: 'medium' as const },
    toolChoice: undefined as string | undefined,
  },
  modelProvider: {},
  getModel: vi.fn(async () => resolvedModel),
} as unknown as LLMConfig

describe('WorkerAgent', () => {
  const agentName = 'Test Agent'
  const agentInstructions = 'Test instructions for the agent'
  const agentCustomTools: Tool[] = [
    {
      name: 'custom-tool-1',
      description: 'Description for custom tool 1',
    } as Tool,
    {
      name: 'custom-tool-2',
      description: 'Description for custom tool 2',
    } as Tool,
  ]

  const campaignsContext = [
    {
      id: '1234-5678-9012-3456',
      name: 'Campaign 1',
      agent_context: 'This is some context coming from campaigns',
    },
  ]

  const contactInfo: ContactInfo[] = [
    {
      name: 'email',
      value: 'test@test.com',
      type: 'string',
      description: 'User email',
    },
    {
      name: 'phone',
      value: '1234567890',
      type: 'string',
      description: 'User phone',
    },
    {
      name: 'address',
      value: '123 Main St, Anytown, USA',
      type: 'string',
      description: 'User address',
    },
  ]
  const inputGuardrailRules: GuardrailRule[] = [
    {
      name: 'is_offensive',
      description: 'Whether the user input is offensive.',
    },
  ]
  const sourceIds: string[] = ['123', '456']

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(Date.prototype, 'toISOString').mockReturnValue(
      '2024-01-01T00:00:00.000Z'
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should initialize correctly with name, instructions and tools', async () => {
    const worker = await SpecialistAgent.create({
      name: agentName,
      instructions: agentInstructions,
      llmConfig: mockLlmConfig,
      tools: agentCustomTools,
      contactInfo,
      inputGuardrailRules,
      sourceIds,
      campaignsContext,
      logger: mockLogger,
      guardrailTrackingContext: mockGuardrailTrackingContext,
    })
    const workerAgent = worker.getAgent()
    const expectedInstructions = `<instructions>\n${agentInstructions}\n</instructions>\n\n<metadata>\nCurrent Date: 2024-01-01T00:00:00.000Z\n</metadata>\n\n<contact_info_fields>${toCompactContactJson(contactInfo)}</contact_info_fields>\n\n<campaign_context_1>\nThis is some context coming from campaigns\n</campaign_context_1>\n\n<output>\nReturn a JSON that follows the output schema provided. Never return multiple output schemas concatenated by a line break.\n<example>\n${'{"messages":[{"type":"text","content":{"text":"Hello, how can I help you today?"}}]}'}\n</example>\n</output>`

    expect(workerAgent.name).toBe(agentName)
    expect(workerAgent.instructions).toBe(expectedInstructions)
    expect(workerAgent.tools).toHaveLength(3) // 2 custom tools + 1 retrieveKnowledge tool
    expect(workerAgent.tools[0]).toEqual(
      expect.objectContaining({
        name: 'retrieve_knowledge',
        sourceIds,
      })
    )
  })

  describe('Contact info prompt format', () => {
    const extractContactInfoFields = (instructions: string) =>
      instructions.match(
        /<contact_info_fields>([\s\S]*?)<\/contact_info_fields>/
      )?.[1]

    const createAgent = async (contactInfoOverride: ContactInfo[]) =>
      (
        await SpecialistAgent.create({
          name: agentName,
          instructions: agentInstructions,
          llmConfig: mockLlmConfig,
          tools: [],
          contactInfo: contactInfoOverride,
          inputGuardrailRules: [],
          sourceIds: [],
          campaignsContext: undefined,
          logger: mockLogger,
          guardrailTrackingContext: mockGuardrailTrackingContext,
        })
      ).getAgent()

    it('should serialize contact info as compact JSON inside contact_info_fields', async () => {
      const workerAgent = await createAgent(contactInfo)
      const contactJson = toCompactContactJson(contactInfo)
      const contactInfoFields = extractContactInfoFields(
        workerAgent.instructions as string
      )

      expect(contactInfoFields).toBe(contactJson)
      expect(contactInfoFields).not.toContain('<name>')
      expect(contactInfoFields).not.toMatch(/\n\s+/)
    })

    it('should include only name and value when description is present', async () => {
      const contactsWithDescription: ContactInfo[] = [
        {
          name: 'email',
          value: 'user@example.com',
          type: 'string',
          description: 'Primary email address',
        },
      ]
      const workerAgent = await createAgent(contactsWithDescription)
      const contactInfoFields = extractContactInfoFields(
        workerAgent.instructions as string
      )

      expect(contactInfoFields).toBe(
        toCompactContactJson(contactsWithDescription)
      )
      expect(contactInfoFields).not.toContain('Primary email address')
      expect(contactInfoFields).not.toContain('"type"')
      expect(contactInfoFields).not.toContain('"description"')
    })

    it('should serialize contacts without description the same way', async () => {
      const contactsWithoutDescription: ContactInfo[] = [
        {
          name: 'phone',
          value: '+34123456789',
          type: 'string',
        },
      ]
      const workerAgent = await createAgent(contactsWithoutDescription)
      const contactInfoFields = extractContactInfoFields(
        workerAgent.instructions as string
      )

      expect(contactInfoFields).toBe(
        toCompactContactJson(contactsWithoutDescription)
      )
      expect(contactInfoFields).not.toContain('"description"')
    })
  })

  describe('Campaign context handling', () => {
    it('should NOT include campaign_context when campaignsContext is undefined', async () => {
      const worker = await SpecialistAgent.create({
        name: agentName,
        instructions: agentInstructions,
        llmConfig: mockLlmConfig,
        tools: agentCustomTools,
        contactInfo,
        inputGuardrailRules: [],
        sourceIds: [],
        campaignsContext: undefined,
        logger: mockLogger,
        guardrailTrackingContext: mockGuardrailTrackingContext,
      })
      const workerAgent = worker.getAgent()

      expect(workerAgent.instructions).not.toContain('<campaign_context')
    })

    it('should NOT include campaign_context when agent_context is undefined', async () => {
      const campaignWithoutContext = [
        {
          id: '1234-5678-9012-3456',
          name: 'Campaign without context',
          // agent_context is undefined
        },
      ]

      const worker = await SpecialistAgent.create({
        name: agentName,
        instructions: agentInstructions,
        llmConfig: mockLlmConfig,
        tools: agentCustomTools,
        contactInfo,
        inputGuardrailRules: [],
        sourceIds: [],
        campaignsContext: campaignWithoutContext,
        logger: mockLogger,
        guardrailTrackingContext: mockGuardrailTrackingContext,
      })
      const workerAgent = worker.getAgent()

      expect(workerAgent.instructions).not.toContain('<campaign_context')
    })

    it('should NOT include campaign_context when agent_context is empty string', async () => {
      const campaignWithEmptyContext = [
        {
          id: '1234-5678-9012-3456',
          name: 'Campaign with empty context',
          agent_context: '',
        },
      ]

      const worker = await SpecialistAgent.create({
        name: agentName,
        instructions: agentInstructions,
        llmConfig: mockLlmConfig,
        tools: agentCustomTools,
        contactInfo,
        inputGuardrailRules: [],
        sourceIds: [],
        campaignsContext: campaignWithEmptyContext,
        logger: mockLogger,
        guardrailTrackingContext: mockGuardrailTrackingContext,
      })
      const workerAgent = worker.getAgent()

      // Empty string is falsy, so campaign_context should not be included
      expect(workerAgent.instructions).not.toContain('<campaign_context')
    })

    it('should include campaign_context when agent_context has content', async () => {
      const campaignWithContext = [
        {
          id: '1234-5678-9012-3456',
          name: 'Campaign with context',
          agent_context: 'This is the campaign context for the agent',
        },
      ]

      const worker = await SpecialistAgent.create({
        name: agentName,
        instructions: agentInstructions,
        llmConfig: mockLlmConfig,
        tools: agentCustomTools,
        contactInfo,
        inputGuardrailRules: [],
        sourceIds: [],
        campaignsContext: campaignWithContext,
        logger: mockLogger,
        guardrailTrackingContext: mockGuardrailTrackingContext,
      })
      const workerAgent = worker.getAgent()

      expect(workerAgent.instructions).toContain('<campaign_context_1>')
      expect(workerAgent.instructions).toContain(
        'This is the campaign context for the agent'
      )
    })
  })

  describe('outputMessagesSchemas handling', () => {
    it('should pass outputType to Agent when outputMessagesSchemas is provided', async () => {
      const customVideoSchema = z.object({
        type: z.enum(['customVideo']),
        content: z.object({
          videoUrl: z.string(),
        }),
      })

      await SpecialistAgent.create({
        name: agentName,
        instructions: agentInstructions,
        llmConfig: mockLlmConfig,
        tools: agentCustomTools,
        contactInfo,
        inputGuardrailRules: [],
        sourceIds: [],
        outputMessagesSchemas: [customVideoSchema],
        campaignsContext: undefined,
        logger: mockLogger,
        guardrailTrackingContext: mockGuardrailTrackingContext,
      })

      expect(mockAgent).toHaveBeenCalledWith(
        expect.objectContaining({ outputType: expect.any(Object) })
      )
    })
  })

  describe('Provider logic (openai vs azure)', () => {
    it('should configure toolChoice for gpt-4 models with retrieveKnowledge tool', async () => {
      await SpecialistAgent.create({
        name: agentName,
        instructions: agentInstructions,
        llmConfig: mockLlmConfig,
        tools: agentCustomTools,
        contactInfo,
        inputGuardrailRules: [],
        sourceIds: ['source-1'], // Triggers retrieveKnowledge tool
        campaignsContext: undefined,
        logger: mockLogger,
        guardrailTrackingContext: mockGuardrailTrackingContext,
      }).then(agent => agent.getAgent())

      expect(mockLogger.logModelSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: 'azure',
          toolChoice: 'retrieve_knowledge',
          hasRetrieveKnowledge: true,
        })
      )
      expect(mockAgent).toHaveBeenCalledWith(
        expect.objectContaining({
          modelSettings: expect.objectContaining({
            toolChoice: 'retrieve_knowledge',
          }),
        })
      )
    })

    it('should set toolChoice for non gpt-4 models with retrieveKnowledge', async () => {
      const nonGpt4LlmConfig = {
        ...mockLlmConfig,
        modelName: 'gpt-5-mini',
        modelSettings: {
          reasoning: { effort: 'none' as const },
          text: { verbosity: 'medium' as const },
          toolChoice: undefined as string | undefined,
        },
      } as unknown as LLMConfig

      await SpecialistAgent.create({
        name: agentName,
        instructions: agentInstructions,
        llmConfig: nonGpt4LlmConfig,
        tools: agentCustomTools,
        contactInfo,
        inputGuardrailRules: [],
        sourceIds: ['source-1'],
        campaignsContext: undefined,
        logger: mockLogger,
        guardrailTrackingContext: mockGuardrailTrackingContext,
      }).then(agent => agent.getAgent())

      expect(mockLogger.logModelSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          toolChoice: 'retrieve_knowledge',
          hasRetrieveKnowledge: true,
        })
      )
      expect(mockAgent).toHaveBeenCalledWith(
        expect.objectContaining({
          modelSettings: expect.objectContaining({
            toolChoice: 'retrieve_knowledge',
          }),
        })
      )
    })

    it('should NOT set toolChoice when sourceIds is empty (no retrieveKnowledge)', async () => {
      await SpecialistAgent.create({
        name: agentName,
        instructions: agentInstructions,
        llmConfig: mockLlmConfig,
        tools: agentCustomTools,
        contactInfo,
        inputGuardrailRules: [],
        sourceIds: [], // Empty - no retrieveKnowledge tool
        campaignsContext: undefined,
        logger: mockLogger,
        guardrailTrackingContext: mockGuardrailTrackingContext,
      }).then(agent => agent.getAgent())

      expect(mockLogger.logModelSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          hasRetrieveKnowledge: false,
        })
      )
    })

    it('should NOT set toolChoice to retrieve_knowledge when disableForceRetrieveKnowledge is true', async () => {
      await SpecialistAgent.create({
        name: agentName,
        instructions: agentInstructions,
        llmConfig: mockLlmConfig,
        tools: agentCustomTools,
        contactInfo,
        inputGuardrailRules: [],
        sourceIds: ['source-1'],
        disableForceRetrieveKnowledge: true,
        campaignsContext: undefined,
        logger: mockLogger,
        guardrailTrackingContext: mockGuardrailTrackingContext,
      }).then(agent => agent.getAgent())

      expect(mockLogger.logModelSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          hasRetrieveKnowledge: true,
        })
      )
      expect(mockLogger.logModelSettings).toHaveBeenCalledWith(
        expect.not.objectContaining({
          toolChoice: 'retrieve_knowledge',
        })
      )
      expect(mockAgent).toHaveBeenCalledWith(
        expect.objectContaining({
          modelSettings: expect.objectContaining({
            toolChoice: undefined,
          }),
        })
      )
    })

    it('should set resolved model for azure provider', async () => {
      // Default OPENAI_PROVIDER is 'azure'
      await SpecialistAgent.create({
        name: agentName,
        instructions: agentInstructions,
        llmConfig: mockLlmConfig,
        tools: agentCustomTools,
        contactInfo,
        inputGuardrailRules: [],
        sourceIds: [],
        campaignsContext: undefined,
        logger: mockLogger,
        guardrailTrackingContext: mockGuardrailTrackingContext,
      }).then(agent => agent.getAgent())

      expect(mockAgent).toHaveBeenCalledWith(
        expect.objectContaining({ model: resolvedModel })
      )
    })

    it('should set reasoning and text settings for azure provider (same as openai)', async () => {
      // Default OPENAI_PROVIDER is 'azure'
      await SpecialistAgent.create({
        name: agentName,
        instructions: agentInstructions,
        llmConfig: mockLlmConfig,
        tools: agentCustomTools,
        contactInfo,
        inputGuardrailRules: [],
        sourceIds: [],
        campaignsContext: undefined,
        logger: mockLogger,
        guardrailTrackingContext: mockGuardrailTrackingContext,
      }).then(agent => agent.getAgent())

      expect(mockLogger.logModelSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: 'azure',
          model: 'gpt-4.1-mini',
          reasoning: { effort: 'none' },
          text: { verbosity: 'medium' },
        })
      )
      expect(mockAgent).toHaveBeenCalledWith(
        expect.objectContaining({
          modelSettings: expect.objectContaining({
            reasoning: { effort: 'none' },
            text: { verbosity: 'medium' },
          }),
        })
      )
    })
  })
})

// Separate describe block for OpenAI provider tests
describe('WorkerAgent - OpenAI Provider', () => {
  const agentName = 'Test Agent'
  const agentInstructions = 'Test instructions for the agent'
  const agentCustomTools: Tool[] = []
  const contactInfo: ContactInfo[] = [
    {
      name: 'email',
      value: 'test@test.com',
      type: 'string',
      description: 'User email',
    },
    {
      name: 'phone',
      value: '1234567890',
      type: 'string',
      description: 'User phone',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(Date.prototype, 'toISOString').mockReturnValue(
      '2024-01-01T00:00:00.000Z'
    )

    // Set provider to 'openai' for these tests
    mockConstants.LLM_PROVIDER = 'openai'
  })

  afterEach(() => {
    vi.restoreAllMocks()
    // Reset to default azure provider
    mockConstants.LLM_PROVIDER = 'azure'
  })

  it('should set reasoning setting with effort: none for openai provider', async () => {
    await SpecialistAgent.create({
      name: agentName,
      instructions: agentInstructions,
      llmConfig: mockLlmConfig,
      tools: agentCustomTools,
      contactInfo,
      inputGuardrailRules: [],
      sourceIds: [],
      campaignsContext: undefined,
      logger: mockLogger,
      guardrailTrackingContext: mockGuardrailTrackingContext,
    }).then(agent => agent.getAgent())

    expect(mockLogger.logModelSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'openai',
        reasoning: { effort: 'none' },
      })
    )
  })

  it('should set text setting with verbosity: medium for openai provider', async () => {
    await SpecialistAgent.create({
      name: agentName,
      instructions: agentInstructions,
      llmConfig: mockLlmConfig,
      tools: agentCustomTools,
      contactInfo,
      inputGuardrailRules: [],
      sourceIds: [],
      campaignsContext: undefined,
      logger: mockLogger,
      guardrailTrackingContext: mockGuardrailTrackingContext,
    }).then(agent => agent.getAgent())

    expect(mockLogger.logModelSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        text: { verbosity: 'medium' },
      })
    )
  })

  it('should set resolved model for openai provider', async () => {
    await SpecialistAgent.create({
      name: agentName,
      instructions: agentInstructions,
      llmConfig: mockLlmConfig,
      tools: agentCustomTools,
      contactInfo,
      inputGuardrailRules: [],
      sourceIds: [],
      campaignsContext: undefined,
      logger: mockLogger,
      guardrailTrackingContext: mockGuardrailTrackingContext,
    }).then(agent => agent.getAgent())

    expect(mockAgent).toHaveBeenCalledWith(
      expect.objectContaining({ model: resolvedModel })
    )
  })

  it('should set toolChoice for gpt-4 models even with openai provider', async () => {
    await SpecialistAgent.create({
      name: agentName,
      instructions: agentInstructions,
      llmConfig: mockLlmConfig,
      tools: agentCustomTools,
      contactInfo,
      inputGuardrailRules: [],
      sourceIds: ['source-1'], // This adds retrieveKnowledge tool
      campaignsContext: undefined,
      logger: mockLogger,
      guardrailTrackingContext: mockGuardrailTrackingContext,
    }).then(agent => agent.getAgent())

    expect(mockLogger.logModelSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'openai',
        toolChoice: 'retrieve_knowledge',
        hasRetrieveKnowledge: true,
      })
    )
    expect(mockAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        modelSettings: expect.objectContaining({
          toolChoice: 'retrieve_knowledge',
        }),
      })
    )
  })
})
