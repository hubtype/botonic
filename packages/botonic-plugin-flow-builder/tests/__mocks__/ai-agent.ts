import type { InferenceResponse } from '@botonic/core'
import { vi } from 'vitest'

export function mockAiAgentResponse({
  messages = [],
  toolsExecuted = [],
  memoryLength = 0,
  inputGuardrailsTriggered = [],
  outputGuardrailsTriggered = [],
  exit = false,
  doNothing = false,
  error = false,
  startingAgentName = 'main_agent',
  lastAgentName = 'main_agent',
  availableSpecialists = [],
  isTransferredToSpecialist = false,
}: Partial<InferenceResponse>) {
  return vi.fn(() => {
    const response: InferenceResponse = {
      messages,
      toolsExecuted,
      memoryLength,
      inputGuardrailsTriggered,
      outputGuardrailsTriggered,
      exit,
      doNothing,
      error,
      startingAgentName,
      lastAgentName,
      availableSpecialists,
      isTransferredToSpecialist,
    }

    return Promise.resolve(response)
  })
}
