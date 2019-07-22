import axios from 'axios'

export default class BotonicPluginDialogflow {
  constructor(options) {
    this.options = options
    this.defaultVersion = '20150910'
  }

  async query(data, lang, sessionId) {
    // Data, lang, sessionId and version are required parameters
    // See https://dialogflow.com/docs/reference/agent/query for more information
    return await axios({
      headers: {
        Authorization: `Bearer ${this.options.token}`
      },
      url: `https://api.dialogflow.com/v1/query`,
      params: {
        query: data,
        lang: lang,
        sessionId: sessionId,
        v: this.options.version || this.defaultVersion
      }
    })
  }

  async pre({ input, session, lastRoutePath }) {
    try {
      await this.dialogflowToInput({ input, session, lastRoutePath })
    } catch (error) {
      console.log(error.response)
    }
    return { input, session, lastRoutePath }
  }

  async post({ input, session, lastRoutePath, response }) {}

  async dialogflowToInput({ input, session, lastRoutePath }) {
    let df_session_id = session.user.id
    let intent = null
    let confidence = 0
    let intents = []
    let entities = []
    let defaultFallback = ''
    let dialogflowResponse = null

    let data_to_query = input.data
      ? input.data
      : input.payload
      ? input.payload
      : null
    let dialogflow_resp = await this.query(
      data_to_query,
      session.__locale,
      df_session_id
    )

    if (dialogflow_resp && dialogflow_resp.data) {
      intent = dialogflow_resp.data.result.metadata.intentName
      entities = dialogflow_resp.data.result.parameters
      confidence = dialogflow_resp.data.result.score
      defaultFallback = dialogflow_resp.data.result.speech
      dialogflowResponse = dialogflow_resp.data
    }
    Object.assign(input, {
      intent,
      confidence,
      intents,
      entities,
      defaultFallback,
      dialogflowResponse
    })
    return { input, session, lastRoutePath }
  }
}
