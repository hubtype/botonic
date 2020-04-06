import AssistantV1 from 'ibm-watson/assistant/v1'
import IamAuthenticator from 'ibm-watson/auth'

export default class BotonicPluginWatson {
  constructor(options) {
    this.options = options
  }

  async pre({ input, session, lastRoutePath }) {
    let intent = null
    let confidence = 0
    let intents = []
    let entities = []

    try {
      const assistant = new AssistantV1({
        authenticator: new IamAuthenticator({ apikey: this.options.apiKey }),
        url: this.options.url,
        version: '2018-09-19',
      })

      const res = await assistant.message({
        input: { text: input.data },
        workspaceId: this.options.workspaceId,
      })
      intent = res.result.intents[0].intent
      confidence = res.result.intents[0].intent.confidence
      intents = res.result.intents
      entities = res.result.entities
    } catch (error) {
      console.log(error)
    }
    Object.assign(input, { intent, confidence, intents, entities })
  }

  post({ input, session, lastRoutePath, response }) {}
}
