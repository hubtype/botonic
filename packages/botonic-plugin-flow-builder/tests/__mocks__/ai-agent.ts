import { AiAgentInferenceResponse } from '../../src/types'

export function mockAiAgentResponse({
  messages = [],
  toolsExecuted = [],
  inputGuardrailTriggered = false,
  outputGuardrailTriggered = false,
  exit = false,
}: Partial<AiAgentInferenceResponse>) {
  return jest.fn(() => {
    const response: AiAgentInferenceResponse = {
      messages,
      toolsExecuted,
      inputGuardrailTriggered,
      outputGuardrailTriggered,
      exit,
    }
    return Promise.resolve(response)
  })
}
