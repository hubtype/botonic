import { default as fetch } from 'node-fetch'
import { resolveEnv, loadOption } from './utils'
import { detectLang, inputToTensor, predictionToIntent } from './prediction'
import { Preprocessor } from '@botonic/nlu/dist/preprocessor'

global.fetch = fetch

export class NLU {
  constructor(options) {
    return (async () => {
      this.env = await resolveEnv()
      this.languages = []
      this.models = {}
      this.preprocessors = {}
      const langs = Object.keys(options)
      for (const _language of langs) {
        this.languages.push(_language)
        const { nluData, model } = loadOption(_language, this.env)
        this.models[_language] = {
          language: _language,
          model,
          nluData,
        }
        const preprocessor = new Preprocessor()
        if (options[_language].tokenizer)
          preprocessor.tokenizer = options[_language].tokenizer
        if (options[_language].normalizer)
          preprocessor.normalizer = options[_language].normalizer
        if (options[_language].stemmer)
          preprocessor.stemmer = options[_language].stemmer
        this.preprocessors[_language] = preprocessor
      }
      await Promise.all([
        ...Object.values(this.models).map(nlu => nlu.model),
        ...Object.values(this.models).map(nlu => nlu.nluData),
      ])
      for (const [_language, res] of Object.entries(this.models)) {
        const nluData = await res.nluData
        const { intents, maxSeqLen, vocabulary, devEntities } =
          this.env.mode === 'node' ? nluData : nluData.data
        this.preprocessors[_language].vocabulary = vocabulary
        this.preprocessors[_language].maxSeqLen = maxSeqLen
        this.models[_language] = {
          nluData: {
            language: res.language,
            intents,
            maxSeqLen,
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
    const tensor = inputToTensor(input, this.preprocessors[language])
    const prediction = model.predict(tensor).dataSync()
    const intent = predictionToIntent(prediction, nluData.intents, language)
    return { intent }
  }
}
