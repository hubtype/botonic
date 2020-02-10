import axios from 'axios'

export default class BotonicPluginLUIS {
  constructor(options) {
    this.options = options
  }

  async pre({ input, session, lastRoutePath }) {
    let intent = null
    let confidence = 0
    let intents = []
    let entities = []

    try {
      let luis_resp = await axios({
        url: `https://${this.options.region}.api.cognitive.microsoft.com/luis/v2.0/apps/${this.options.appID}`,
        params: {
          'subscription-key': this.options.endpointKey,
          q: input.data,
          verbose: true,
        },
      })
      if (luis_resp && luis_resp.data) {
        intent = luis_resp.data.topScoringIntent.intent
        confidence = luis_resp.data.topScoringIntent.score
        intents = this.convertIntents(luis_resp.data.intents)
        entities = luis_resp.data.entities
      }
    } catch (e) {}

    Object.assign(input, { intent, confidence, intents, entities })

    return { input, session, lastRoutePath }
  }

  convertIntents(luisIntents) {
    return luisIntents.map(li => ({ intent: li.intent, confidence: li.score }))
  }

  async post({ input, session, lastRoutePath, response }) {}
}
