import axios from 'axios'

// TODO: Documentate changes

const REQUIRED_OPTIONS = ['apikey', 'url', 'assistant_id']
export default class BotonicPluginWatson {
  constructor(options) {
    try {
      this.validateOptions(options)
      this.init(options)
    } catch (e) {
      console.error(String(e))
    }
  }

  init(options) {
    this.apiKey = options.apikey
    this.url = options.url
    this.assistantId = options.assistant_id
    this.version = options.version || '2020-04-01'
    this.sessionId = this.getSessionId()
  }

  validateOptions(options) {
    if (!options) throw new Error('No options provided.')
    const requiredOptionsProvided = Object.entries(options).filter(([k, _]) =>
      REQUIRED_OPTIONS.includes(k)
    )
    if (requiredOptionsProvided.length !== REQUIRED_OPTIONS.length)
      throw new Error('Missing one or more fields.')
    if (requiredOptionsProvided.some(([_, v]) => v === undefined))
      throw new Error('One or more fields are not defined.')
  }

  getAssistantEndpoint() {
    return `${this.url}/v2/assistants/${this.assistantId}`
  }

  async getSessionId() {
    const {
      data: { session_id },
    } = await axios.post(
      `${this.getAssistantEndpoint()}/sessions?version=${this.version}`,
      {},
      {
        auth: { username: 'apikey', password: this.apiKey },
        validateStatus: status => status === 201,
      }
    )
    return session_id
  }

  async pre({ input }) {
    let intent = null
    let confidence = 0
    let intents = []
    let entities = []
    try {
      // TODO: Understand sessionId logic/api-limits
      const sessionId = await this.sessionId
      const {
        data: { output },
      } = await axios.post(
        `${this.getAssistantEndpoint()}/sessions/${sessionId}/message?version=${
          this.version
        }`,
        { input: { text: input.data } },
        {
          auth: { username: 'apikey', password: this.apiKey },
          headers: { 'Content-Type': 'application/json' },
          validateStatus: status => status === 200,
        }
      )
      // TODO: Convert results to our Botonic standard
      intent = output.intents[0].intent
      confidence = output.intents[0].confidence
      intents = output.intents
      entities = output.entities
      const defaultFallback = output.generic //example in dialogflow plugin, decide which name?
      Object.assign(input, {
        intent,
        confidence,
        intents,
        entities,
        defaultFallback,
      })
    } catch (e) {
      console.error(String(e))
    }
  }

  post({ input, session, lastRoutePath, response }) {}
}
