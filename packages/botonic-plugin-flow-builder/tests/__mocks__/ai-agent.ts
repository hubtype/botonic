import { AgenticOutputMessage, InferenceResponse } from '../../src/types'

export function mockAiAgentResponse(messages: AgenticOutputMessage[]) {
  return jest.fn(() => {
    const response: InferenceResponse = {
      messages,
      toolsExecuted: [],
      exit: false,
      inputGuardrailTriggered: false,
      outputGuardrailTriggered: false,
    }
    return Promise.resolve(response)
  })
}
