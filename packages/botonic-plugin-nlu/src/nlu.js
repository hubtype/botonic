import { default as fetch } from 'node-fetch'
import { resolveEnv, loadOption } from './utils'
import { detectLang } from '@botonic/nlu/lib/preprocessing'
import {
  getIntent,
  getEntities,
  getPrediction
} from '@botonic/nlu/lib/prediction'

global.fetch = fetch

export class NLU {
  constructor(languages) {
    return (async () => {
      this.env = await resolveEnv()
      this.langs = []
      this.models = {}
      for (let language of languages) {
        this.langs.push(language)
        let { nluData, model } = loadOption(language, this.env)
        this.models[language] = {
          lang: language,
          model: model,
          nluData: nluData
        }
      }
      await Promise.all([
        ...Object.values(this.models).map(nlu => nlu.model),
        ...Object.values(this.models).map(nlu => nlu.nluData)
      ])
      for (let [lang, data] of Object.entries(this.models)) {
        let nluData = await data.nluData
        let { intentsDict, maxSeqLength, vocabulary, devEntities } =
          this.env.mode === 'node' ? nluData : nluData.data
        this.models[lang] = {
          nluData: {
            lang: data.lang,
            intentsDict,
            maxSeqLength: maxSeqLength,
            vocabulary,
            devEntities
          },
          model: await data.model
        }
      }
      return this
    })()
  }

  predict(input) {
    let language = detectLang(input, this.langs)
    let { model, nluData } = this.models[language]
    let prediction = getPrediction(input, model, nluData)
    let intent = getIntent(prediction, nluData.intentsDict, language)
    let entities = getEntities(input, nluData.devEntities)
    return { intent, entities }
  }
}
