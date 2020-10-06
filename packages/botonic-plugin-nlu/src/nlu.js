import { default as fetch } from 'node-fetch'
import { resolveEnv, loadOption } from './utils'
import { detectLang, inputToTensor, predictionToIntent } from './prediction'

global.fetch = fetch

export class NLU {
  constructor(options) {
    return (async () => {
      this.env = await resolveEnv()
      this.languages = []
      this.tokenizer = options.tokenizer
      this.models = {}
      for (const _language of options.langs) {
        this.languages.push(_language)
        const { nluData, model } = loadOption(_language, this.env)
        this.models[_language] = {
          language: _language,
          model,
          nluData,
        }
      }
      await Promise.all([
        ...Object.values(this.models).map(nlu => nlu.model),
        ...Object.values(this.models).map(nlu => nlu.nluData),
      ])
      for (const [_language, res] of Object.entries(this.models)) {
        const nluData = await res.nluData
        const { intents, maxSeqLength, vocabulary, devEntities } =
          this.env.mode === 'node' ? nluData : nluData.data
        this.models[_language] = {
          nluData: {
            language: res.language,
            intents,
            maxSeqLength,
            vocabulary,
            devEntities,
          },
          model: await res.model,
        }
      }
      return this
    })()
  }

  predict(input) {
    const language = detectLang(input, this.languages)
    const { model, nluData } = this.models[language]
    const { maxSeqLength, vocabulary, intents } = nluData
    const tensor = inputToTensor(
      input,
      this.tokenizer,
      vocabulary,
      maxSeqLength
    )
    const prediction = model.predict(tensor).dataSync()
    const intent = predictionToIntent(prediction, intents, language)
    return { intent }
  }
}
