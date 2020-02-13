import { default as fetch } from 'node-fetch'
import { resolveEnv, loadOption } from './utils'
import { detectLang } from '@botonic/nlu/lib/preprocessing'
import {
  getIntent,
  getEntities,
  getPrediction,
} from '@botonic/nlu/lib/prediction'

global.fetch = fetch

export class NLU {
  constructor(languages) {
    return (async () => {
      this.env = await resolveEnv()
      this.languages = []
      this.models = {}
      for (const language of languages) {
        this.languages.push(language)
        const { nluData, model } = loadOption(language, this.env)
        this.models[language] = {
          language,
          model,
          nluData,
        }
      }
      await Promise.all([
        ...Object.values(this.models).map(nlu => nlu.model),
        ...Object.values(this.models).map(nlu => nlu.nluData),
      ])
      for (const [language, res] of Object.entries(this.models)) {
        const nluData = await res.nluData
        const { intentsDict, maxSeqLength, vocabulary, devEntities } =
          this.env.mode === 'node' ? nluData : nluData.data
        this.models[language] = {
          nluData: {
            language: res.language,
            intentsDict,
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
    const prediction = getPrediction(input, model, nluData)
    const intent = getIntent(prediction, nluData.intentsDict, language)
    const entities = { entities: getEntities(input, nluData.devEntities) }
    return { intent, entities }
  }
}
