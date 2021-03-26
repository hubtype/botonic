import axios from 'axios'

import WatsonOutputParser from './watson-output-parser'

export default class BotonicPluginWatson {
  REQUIRED_OPTION_FIELDS = ['apikey', 'url', 'assistant_id']

  EXPECTED_SESSION_ID_REQUEST_STATUS = 201
  EXPECTED_OUTPUT_REQUEST_STATUS = 200

  UNKNOWN_INTENT_LABEL = 'unknown'
  UNKNOWN_INTENT_CONFIDENCE = 1
  UNKNOWN_INTENT = {
    label: this.UNKNOWN_INTENT_LABEL,
    confidence: this.UNKNOWN_INTENT_CONFIDENCE,
  }

  constructor(options) {
    try {
      this.validateOptions(options)
      this.init(options)
    } catch (e) {
      console.error(String(e))
    }
  }

  validateOptions(options) {
    if (!options) throw new Error('No options provided.')
    if (!this.areRequiredOptionsProvided(options))
      throw new Error('Missing one or more fields.')
    if (!this.areRequiredOptionsDefined(options))
      throw new Error('One or more fields are not defined.')
  }

  areRequiredOptionsProvided(options) {
    const requiredOptionsFieldsProvided = Object.keys(options).filter(field =>
      this.REQUIRED_OPTION_FIELDS.includes(field)
    )
    return (
      requiredOptionsFieldsProvided.length == this.REQUIRED_OPTION_FIELDS.length
    )
  }

  areRequiredOptionsDefined(options) {
    const requiredOptionsProvided = Object.entries(
      options
    ).filter(([field, _]) => this.REQUIRED_OPTION_FIELDS.includes(field))
    return !requiredOptionsProvided.some(([_, value]) => value === undefined)
  }

  init(options) {
    this.apiKey = options.apikey
    this.url = options.url
    this.assistantId = options.assistant_id
    this.version = options.version || '2020-04-01'
    this.sessionId = this.getSessionId()
  }

  async getSessionId() {
    const { data } = await axios.post(
      `${this.getAssistantEndpoint()}/sessions?version=${this.version}`,
      {},
      {
        auth: this.getAuthentication(),
        validateStatus: status =>
          status === this.EXPECTED_SESSION_ID_REQUEST_STATUS,
      }
    )
    return data.session_id
  }

  getAssistantEndpoint() {
    return `${this.url}/v2/assistants/${this.assistantId}`
  }

  getAuthentication() {
    return { username: 'apikey', password: this.apiKey }
  }

  async pre({ input }) {
    try {
      const output = await this.getWatsonOutput(input.data)
      Object.assign(input, WatsonOutputParser.parse(output))
    } catch (e) {
      console.error(String(e))
    }
  }

  async getWatsonOutput(text) {
    const sessionId = await this.sessionId
    const { data } = await axios.post(
      `${this.getAssistantEndpoint()}/sessions/${sessionId}/message?version=${
        this.version
      }`,
      { input: { text } },
      {
        auth: this.getAuthentication(),
        headers: { 'Content-Type': 'application/json' },
        validateStatus: status =>
          status === this.EXPECTED_OUTPUT_REQUEST_STATUS,
      }
    )
    return data.output
  }

  post({ input, session, lastRoutePath, response }) {}
}
