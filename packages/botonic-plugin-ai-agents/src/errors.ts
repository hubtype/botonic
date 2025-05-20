export class AiAgentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AiAgentError'
  }
}
