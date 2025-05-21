interface MockAiAgentOptions {
  message: { role: string; content: string }
}

export function mockAiAgentResponse({ message }: MockAiAgentOptions) {
  return jest.fn(() => {
    return Promise.resolve({ message })
  })
}
