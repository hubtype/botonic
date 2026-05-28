import { z } from 'zod'
import type { DebugLogger } from '../src/debug-logger'
import { OutputSchema } from '../src/structured-output/index'
import type { GuardrailRule, Tool } from '../src/types'

// Create a mock disabled logger for tests (no-op implementations)
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

// Store captured Agent config for assertions
let capturedAgentConfig: any = null

// Mock OpenAI Agent class
jest.mock('@openai/agents', () => ({
  Agent: jest.fn().mockImplementation(config => {
    capturedAgentConfig = config
    return {
      name: config.name,
      instructions: config.instructions,
      tools: config.tools,
      contactInfo: config.contactInfo,
      model: config.model,
      modelSettings: config.modelSettings,
    }
  }),
}))

jest.mock('../src/tools', () => ({
  createRetrieveKnowledge: jest.fn((sourceIds: string[]) => ({
    name: 'retrieve_knowledge',
    description: 'Consult the knowledge base for information before answering.',
    sourceIds,
  })),
  mandatoryTools: [],
  RETRIEVE_KNOWLEDGE_TOOL_NAME: 'retrieve_knowledge',
}))

// Mock constants - can be overridden per test
const mockConstants = {
  LLM_PROVIDERS: { OPENAI: 'openai', AZURE: 'azure' },
  LLM_PROVIDER: 'azure' as 'openai' | 'azure',
  LLM_OPENAI_MODEL: 'gpt-4.1-mini',
}

jest.mock('../src/constants', () => mockConstants)

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
  getModel: jest.fn().mockResolvedValue(resolvedModel),
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
    jest.clearAllMocks()
    capturedAgentConfig = null
    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2024-01-01T00:00:00.000Z')
  })

  afterEach(() => {
    jest.restoreAllMocks()
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
    const structuredContactInfo = contactInfo
      .map(
        info =>
          ` <contact_info>
              <name>${info.name}</name>
              <value>${info.value}</value>
              <type>${info.type}</type>
              ${
                info.description
                  ? `<description>${info.description}</description>`
                  : ''
              }
            </contact_info>`
      )
      .join('\n')

    const expectedInstructions = `<instructions>\n${agentInstructions}\n</instructions>\n\n<metadata>\nCurrent Date: 2024-01-01T00:00:00.000Z\n</metadata>\n\n<contact_info_fields>\n${structuredContactInfo}</contact_info_fields>\n\n<campaign_context_1>\nThis is some context coming from campaigns\n</campaign_context_1>\n\n<output>\nReturn a JSON that follows the output schema provided. Never return multiple output schemas concatenated by a line break.\n<example>\n${'{"messages":[{"type":"text","content":{"text":"Hello, how can I help you today?"}}]}'}\n</example>\n</output>`

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

  describe('Structured Output Schema Validation', () => {
    it('should validate textWithButtons with multiple buttons', () => {
      const validOutput = {
        messages: [
          {
            type: 'textWithButtons',
            content: {
              text: 'Choose an option:',
              buttons: [
                { text: 'Option 1' },
                { text: 'Option 2' },
                { text: 'Option 3' },
              ],
            },
          },
        ],
      }

      const result = OutputSchema.safeParse(validOutput)
      expect(result.success).toBe(true)
    })

    it('should validate carousel with multiple elements', () => {
      const validOutput = {
        messages: [
          {
            type: 'carousel',
            content: {
              elements: [
                {
                  title: 'Product 1',
                  subtitle: 'Description 1',
                  image: 'https://example.com/1.jpg',
                  button: { text: 'View', url: 'https://example.com/1' },
                },
                {
                  title: 'Product 2',
                  subtitle: 'Description 2',
                  image: 'https://example.com/2.jpg',
                  button: { text: 'Buy', url: 'https://example.com/2' },
                },
              ],
            },
          },
        ],
      }

      const result = OutputSchema.safeParse(validOutput)
      expect(result.success).toBe(true)
    })

    it('should reject invalid button structure', () => {
      const invalidOutput = {
        messages: [
          {
            type: 'textWithButtons',
            content: {
              text: 'Choose an option:',
              buttons: [
                { text: 'Valid button' },
                {}, // Invalid empty button
              ],
            },
          },
        ],
      }

      const result = OutputSchema.safeParse(invalidOutput)
      expect(result.success).toBe(false)
    })

    it('should reject carousel with missing required fields', () => {
      const invalidOutput = {
        messages: [
          {
            type: 'carousel',
            content: {
              elements: [
                {
                  title: 'Product 1',
                  // Missing subtitle, image, button
                },
              ],
            },
          },
        ],
      }

      const result = OutputSchema.safeParse(invalidOutput)
      expect(result.success).toBe(false)
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
    it('should build with only base schemas when outputMessagesSchemas is not provided', async () => {
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

      expect(capturedAgentConfig).toBeDefined()
      const outputType = capturedAgentConfig.outputType

      const validBaseMessage = {
        messages: [{ type: 'text', content: { text: 'Hello' } }],
      }
      expect(outputType.safeParse(validBaseMessage).success).toBe(true)

      const invalidCustomMessage = {
        messages: [
          {
            type: 'customVideo',
            content: { videoUrl: 'https://example.com/video.mp4' },
          },
        ],
      }
      expect(outputType.safeParse(invalidCustomMessage).success).toBe(false)
    })

    it('should include custom schemas when outputMessagesSchemas is provided', async () => {
      const customVideoSchema = z.object({
        type: z.enum(['customVideo']),
        content: z.object({
          videoUrl: z.string(),
          thumbnail: z.string().optional(),
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
      }).then(agent => agent.getAgent())

      expect(capturedAgentConfig).toBeDefined()
      const outputType = capturedAgentConfig.outputType

      const validCustomMessage = {
        messages: [
          {
            type: 'customVideo',
            content: { videoUrl: 'https://example.com/video.mp4' },
          },
        ],
      }
      expect(outputType.safeParse(validCustomMessage).success).toBe(true)

      const validBaseMessage = {
        messages: [{ type: 'text', content: { text: 'Hello' } }],
      }
      expect(outputType.safeParse(validBaseMessage).success).toBe(true)
    })

    it('should include multiple custom schemas when provided', async () => {
      const customVideoSchema = z.object({
        type: z.enum(['customVideo']),
        content: z.object({
          videoUrl: z.string(),
        }),
      })
      const customImageSchema = z.object({
        type: z.enum(['customImage']),
        content: z.object({
          imageUrl: z.string(),
          altText: z.string(),
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
        outputMessagesSchemas: [customVideoSchema, customImageSchema],
        campaignsContext: undefined,
        logger: mockLogger,
        guardrailTrackingContext: mockGuardrailTrackingContext,
      }).then(agent => agent.getAgent())

      expect(capturedAgentConfig).toBeDefined()
      const outputType = capturedAgentConfig.outputType

      const validVideoMessage = {
        messages: [
          {
            type: 'customVideo',
            content: { videoUrl: 'https://example.com/video.mp4' },
          },
        ],
      }
      expect(outputType.safeParse(validVideoMessage).success).toBe(true)

      const validImageMessage = {
        messages: [
          {
            type: 'customImage',
            content: {
              imageUrl: 'https://example.com/image.png',
              altText: 'A test image',
            },
          },
        ],
      }
      expect(outputType.safeParse(validImageMessage).success).toBe(true)
    })

    it('should reject invalid custom message when custom schemas are provided', async () => {
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
      }).then(agent => agent.getAgent())

      expect(capturedAgentConfig).toBeDefined()
      const outputType = capturedAgentConfig.outputType

      const invalidMessage = {
        messages: [
          {
            type: 'customVideo',
            content: { videoUrl: 123 },
          },
        ],
      }
      expect(outputType.safeParse(invalidMessage).success).toBe(false)
    })

    it('should produce same schema as OutputSchema when empty array is provided', async () => {
      await SpecialistAgent.create({
        name: agentName,
        instructions: agentInstructions,
        llmConfig: mockLlmConfig,
        tools: agentCustomTools,
        contactInfo,
        inputGuardrailRules: [],
        sourceIds: [],
        outputMessagesSchemas: [],
        campaignsContext: undefined,
        logger: mockLogger,
        guardrailTrackingContext: mockGuardrailTrackingContext,
      }).then(agent => agent.getAgent())

      expect(capturedAgentConfig).toBeDefined()
      const outputType = capturedAgentConfig.outputType

      const testMessages = [
        { messages: [{ type: 'text', content: { text: 'Hello' } }] },
        {
          messages: [
            {
              type: 'textWithButtons',
              content: {
                text: 'Pick one',
                buttons: [{ text: 'A' }],
              },
            },
          ],
        },
        { messages: [{ type: 'exit' }] },
      ]

      for (const msg of testMessages) {
        expect(outputType.safeParse(msg).success).toBe(
          OutputSchema.safeParse(msg).success
        )
      }
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
      expect(capturedAgentConfig.modelSettings.toolChoice).toBe(
        'retrieve_knowledge'
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
      expect(capturedAgentConfig.modelSettings.toolChoice).toBe(
        'retrieve_knowledge'
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

      expect(capturedAgentConfig).toBeDefined()
      expect(capturedAgentConfig.model).toBe(resolvedModel)
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
      expect(capturedAgentConfig.modelSettings).toMatchObject({
        reasoning: { effort: 'none' },
        text: { verbosity: 'medium' },
      })
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
    jest.clearAllMocks()
    capturedAgentConfig = null
    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2024-01-01T00:00:00.000Z')

    // Set provider to 'openai' for these tests
    mockConstants.LLM_PROVIDER = 'openai'
  })

  afterEach(() => {
    jest.restoreAllMocks()
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

    expect(capturedAgentConfig).toBeDefined()
    expect(capturedAgentConfig.model).toBe(resolvedModel)
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
    expect(capturedAgentConfig.modelSettings.toolChoice).toBe(
      'retrieve_knowledge'
    )
  })
})
