import { AIAgentBuilder } from '../src/agent-builder'
import { OutputSchema } from '../src/structured-output'
import { GuardrailRule, Tool } from '../src/types'

// Mock OpenAI Agent class
jest.mock('@openai/agents', () => ({
  Agent: jest.fn().mockImplementation(config => {
    return {
      name: config.name,
      instructions: config.instructions,
      tools: config.tools,
      contactInfo: config.contactInfo,
    }
  }),
}))

jest.mock('../src/tools', () => ({
  mandatoryTools: [],
  retrieveKnowledge: {
    name: 'retrieve_knowledge',
    description: 'Consult the knowledge base for information before answering.',
  },
}))

describe('AIAgentBuilder', () => {
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

  const campaignContext = {
    id: '1234-5678-9012-3456',
    name: 'Campaign 1',
    agent_context: 'This is some context coming from campaigns',
  }

  const contactInfo = {
    email: 'test@test.com',
    phone: '1234567890',
    address: '123 Main St, Anytown, USA',
  }
  const inputGuardrailRules: GuardrailRule[] = [
    {
      name: 'is_offensive',
      description: 'Whether the user input is offensive.',
    },
  ]
  const sourceIds: string[] = ['123', '456']

  beforeEach(() => {
    jest.clearAllMocks()
    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2024-01-01T00:00:00.000Z')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('should initialize correctly with name, instructions and tools', () => {
    const aiAgent = new AIAgentBuilder({
      name: agentName,
      instructions: agentInstructions,
      tools: agentCustomTools,
      contactInfo,
      inputGuardrailRules,
      sourceIds,
      campaignContext,
    }).build()
    const expectedInstructions = `<instructions>\n${agentInstructions}\n</instructions>\n\n<metadata>\nCurrent Date: 2024-01-01T00:00:00.000Z\n</metadata>\n\n<contact_info>\nemail: test@test.com\nphone: 1234567890\naddress: 123 Main St, Anytown, USA\n</contact_info>\n\n<campaign_context>\nThis is some context coming from campaigns\n</campaign_context>\n\n<output>\nReturn a JSON that follows the output schema provided. Never return multiple output schemas concatenated by a line break.\n<example>\n${'{"messages":[{"type":"text","content":{"text":"Hello, how can I help you today?"}}]}'}\n</example>\n</output>`

    expect(aiAgent.name).toBe(agentName)
    expect(aiAgent.instructions).toBe(expectedInstructions)
    expect(aiAgent.tools).toHaveLength(3) // 2 custom tools + 1 retrieveKnowledge tool
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
})
