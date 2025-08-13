import { AgenticOutputMessage, InferenceResponse } from '@botonic/core'

export function mockAiAgentResponse(messages: AgenticOutputMessage[]) {
  return jest.fn(() => {
    const response: InferenceResponse = {
      messages,
      toolsExecuted: [],
      exit: false,
      inputGuardrailTriggered: [],
      outputGuardrailTriggered: [],
    }
    return Promise.resolve(response)
  })
}
