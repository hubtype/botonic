import { InferenceResponse } from '@botonic/core'

export function mockAiAgentResponse({
  messages = [],
  toolsExecuted = [],
  inputGuardrailTriggered = [],
  outputGuardrailTriggered = [],
  exit = false,
  error = false,
}: Partial<InferenceResponse>) {
  return jest.fn(() => {
    const response: InferenceResponse = {
      messages,
      toolsExecuted,
      inputGuardrailTriggered,
      outputGuardrailTriggered,
      exit,
      error,
    }

    return Promise.resolve(response)
  })
}
