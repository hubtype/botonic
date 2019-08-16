import { NLU } from './nlu'

export default class BotonicPluginNLU {
  constructor(options) {
    return (async () => {
      this.nlu = await new NLU(options)
      return this
    })()
  }

  async pre({ input, session, lastRoutePath }) {
    try {
      let { intent, confidence, intents } = this.nlu.getIntents(input.data)[0]
      Object.assign(input, { intent, confidence, intents })
    } catch (e) {
      console.log('Cannot predict the results', e)
    }
    return { input, session, lastRoutePath }
  }

  async post({ input, session, lastRoutePath }) {}
}
