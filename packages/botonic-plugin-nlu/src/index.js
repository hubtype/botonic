import { NLU } from './nlu'

export default class BotonicPluginNLU {
  constructor(options) {
    let languages = Object.keys(options)
    return (async () => {
      this.nlu = await new NLU(languages)
      return this
    })()
  }

  async pre({ input, session, lastRoutePath }) {
    try {
      let { intent, entities } = this.nlu.predict(input.data)
      Object.assign(input, intent, entities)
    } catch (e) {
      console.log('Cannot predict the results', e)
    }
    return { input, session, lastRoutePath }
  }

  async post({ input, session, lastRoutePath }) {}
}
