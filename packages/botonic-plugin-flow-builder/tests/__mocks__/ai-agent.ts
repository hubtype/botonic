import { AgenticOutputMessage } from '../../src/types'

export function mockAiAgentResponse(messages: AgenticOutputMessage[]) {
  return jest.fn(() => {
    return Promise.resolve(messages)
  })
}
