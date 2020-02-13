import { NLU } from './nlu'

export default class BotonicPluginNLU {
  constructor(options) {
    return (async () => {
      this.nlu = await new NLU(options.langs)
      return this
    })()
  }

  async pre({ input, session, lastRoutePath }) {
    try {
      if (input.type == 'text' && !input.payload) {
        const { intent, entities } = this.nlu.predict(input.data)
        Object.assign(input, intent, entities)
      }
    } catch (e) {
      // console.log('Cannot predict the results', e)
    }
    return { input, session, lastRoutePath }
  }

  async post({ input, session, lastRoutePath }) {}
}
