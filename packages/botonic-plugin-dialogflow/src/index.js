import axios from 'axios'

export default class BotonicPluginDialogflow {
  constructor(options) {
    this.options = options
  }

  async query(data, lang, sessionId) {
    // Data, lang and sessionId are required parameters
    return await axios({
      headers: {
        Authorization: 'Bearer ' + this.options.token
      },
      url: 'https://api.dialogflow.com/v1/query',
      params: {
        query: data,
        lang: lang,
        sessionId: sessionId
      }
    })
  }

  async pre({ input, session, lastRoutePath }) {
    this.dialogflowToInput({ input, session, lastRoutePath })
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
    let dialogflow_resp = await this.query(
      input.data,
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
