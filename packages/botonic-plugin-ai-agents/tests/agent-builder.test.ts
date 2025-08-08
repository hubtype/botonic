import { AIAgentBuilder } from '../src/agent-builder'
import { Tool } from '../src/types'

// Mock OpenAI Agent class
jest.mock('@openai/agents', () => ({
  Agent: jest.fn().mockImplementation(config => {
    return {
      name: config.name,
      instructions: config.instructions,
      tools: config.tools,
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
      agentCustomTools
    ).build()

    expect(aiAgent.name).toBe(agentName)
    expect(aiAgent.instructions).toContain(agentInstructions)
    expect(aiAgent.tools).toHaveLength(2)
  })
})
