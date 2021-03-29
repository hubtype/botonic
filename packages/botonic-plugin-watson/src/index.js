import axios from 'axios'

import WatsonOutputParser from './watson-output-parser'

export default class BotonicPluginWatson {
  REQUIRED_OPTIONS = ['apikey', 'url', 'assistant_id']

  EXPECTED_SESSION_ID_REQUEST_STATUS = 201
  EXPECTED_OUTPUT_REQUEST_STATUS = 200

  constructor(options) {
    try {
      this.options = options
      this.validateOptions()
      this.init()
    } catch (e) {
      console.error(e)
    }
  }

  validateOptions() {
    if (!this.options) throw new Error('No options provided.')
    this.REQUIRED_OPTIONS.forEach(o => this.checkRequiredOption(o))
  }

  checkRequiredOption(optionName) {
    if (!Object.keys(this.options).includes(optionName)) {
      throw new Error(`Missing required option '${optionName}'.`)
    }
    if (!this.options[optionName]) {
      throw new Error(`Undefined value for '${optionName}'.`)
    }
  }

  init() {
    this.apiKey = this.options.apikey
    this.url = this.options.url
    this.assistantId = this.options.assistant_id
    this.version = this.options.version || '2020-04-01'
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
      Object.assign(input, WatsonOutputParser.parseToBotonicFormat(output))
    } catch (e) {
      console.error(String(e))
    }
  }

  async getWatsonOutput(text) {
    const sessionId = await this.sessionId
    if (!sessionId) {
      throw new Error('Not executing Watson because initialization failed.')
    }
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
