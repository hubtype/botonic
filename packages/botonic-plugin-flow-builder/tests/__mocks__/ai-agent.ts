import { InferenceResponse } from '@botonic/core'

export function mockAiAgentResponse({
  messages = [],
  toolsExecuted = [],
  inputGuardrailTriggered = [],
  outputGuardrailTriggered = [],
  exit = false,
}: Partial<InferenceResponse>) {
  return jest.fn(() => {
    const response: InferenceResponse = {
      messages,
      toolsExecuted,
      inputGuardrailTriggered,
      outputGuardrailTriggered,
      exit,
    }
    return Promise.resolve(response)
  })
}
