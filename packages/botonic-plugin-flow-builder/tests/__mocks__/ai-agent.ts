import type { InferenceResponse } from '@botonic/core'

export function mockAiAgentResponse({
  messages = [],
  toolsExecuted = [],
  memoryLength = 0,
  inputGuardrailsTriggered = [],
  outputGuardrailsTriggered = [],
  exit = false,
  error = false,
  startingAgentName = 'main_agent',
  lastAgentName = 'main_agent',
  availableSpecialists = [],
  isTransferredToSpecialist = false,
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
      startingAgentName,
      lastAgentName,
      availableSpecialists,
      isTransferredToSpecialist,
    }

    return Promise.resolve(response)
  })
}
