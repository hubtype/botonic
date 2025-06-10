interface MockAiAgentOptions {
  role: string
  content: string
}

export function mockAiAgentResponse({ role, content }: MockAiAgentOptions) {
  return jest.fn(() => {
    return Promise.resolve({ role, content })
  })
}
