import { AIAgentBuilder } from '../src/agent-builder'
import { Tool } from '../src/types'

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
  const contactInfo = {
    email: 'test@test.com',
    phone: '1234567890',
    address: '123 Main St, Anytown, USA',
  }

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
    const aiAgent = new AIAgentBuilder(
      agentName,
      agentInstructions,
      agentCustomTools,
      contactInfo
    ).build()
    const expectedInstructions = `${agentInstructions}\n\n<metadata>\nCurrent Date: 2024-01-01T00:00:00.000Z\n</metadata>\n\n<contact_info>\nemail: test@test.com\nphone: 1234567890\naddress: 123 Main St, Anytown, USA\n</contact_info>\n\n<output>\nReturn a JSON that follows the output schema provided. Never return multiple output schemas concatenated by a line break.\n<example>\n${'{"messages":[{"type":"text","content":{"text":"Hello, how can I help you today?"}}]}'}\n</example>\n</output>`

    expect(aiAgent.name).toBe(agentName)
    expect(aiAgent.instructions).toBe(expectedInstructions)
    expect(aiAgent.tools).toHaveLength(2)
  })
})
