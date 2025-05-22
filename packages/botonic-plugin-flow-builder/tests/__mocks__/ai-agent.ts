import { AiAgentResponse } from '../../src/types'

export function mockAiAgentResponse({ message }: AiAgentResponse) {
  return jest.fn(() => {
    return Promise.resolve({ message })
  })
}
