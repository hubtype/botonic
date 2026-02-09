import type { InferenceResponse } from '@botonic/core'

export function mockAiAgentResponse({
  messages = [],
  toolsExecuted = [],
  memoryLength = 0,
  inputGuardrailsTriggered = [],
  outputGuardrailsTriggered = [],
  exit = false,
  error = false,
}: Partial<InferenceResponse>) {
  return jest.fn(() => {
    const response: InferenceResponse = {
      messages,
      toolsExecuted,
      memoryLength,
      inputGuardrailsTriggered,
      outputGuardrailsTriggered,
      exit,
      error,
    }

    return Promise.resolve(response)
  })
}
