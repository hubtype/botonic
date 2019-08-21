import axios from 'axios'
import * as tf from '@tensorflow/tfjs'
import { default as fetch } from 'node-fetch'
import path from 'path'
import { readFile, readJSON } from './file-utils'
import { Tokenizer, padSequences, detectLang } from './preprocessing'
import { processEntities } from './ner'
import {
  NLU_DATA_FILENAME,
  MODEL_FILENAME,
  MODELS_DIRNAME,
  NLU_DIRNAME,
  ASSETS_DIRNAME
} from './constants'

const isBrowser = () => {
  return typeof window !== 'undefined' && !window.process
}

const isProd = () => {
  return process.env.STATIC_URL !== undefined
}

global.fetch = fetch

async function resolveEnv() {
  if (isProd() || isBrowser()) {
    if (isProd()) {
      return {
        mode: 'prod',
        uri: `${process.env.STATIC_URL}/${ASSETS_DIRNAME}/${MODELS_DIRNAME}/`
      }
    } else {
      return { mode: 'dev', uri: window.location.href }
    }
  } else {
    return {
      mode: 'node',
      uri: `${path.join(process.cwd(), 'src', NLU_DIRNAME, MODELS_DIRNAME)}/`
    }
  }
}

function loadOption(lang, env) {
  let nlu = {}
  try {
    if (env.mode === 'prod' || env.mode === 'dev') {
      nlu.nluData = axios({
        url: `${env.uri}${lang}/${NLU_DATA_FILENAME}`
      })
      nlu.model = tf.loadLayersModel(`${env.uri}${lang}/${MODEL_FILENAME}`)
    } else {
      nlu.nluData = readJSON(`${env.uri}/${lang}/${NLU_DATA_FILENAME}`)
      nlu.model = tf.loadLayersModel(
        `file://${env.uri}${lang}/${MODEL_FILENAME}`
      )
    }
  } catch (e) {
    console.log('Cannot retrieve NLU Information', e)
  }
  return nlu
}

export class NLU {
  constructor(options) {
    return (async () => {
      this.env = await resolveEnv()
      this.langs = []
      this.nlus = {}
      this.entities = {}
      for (let config of options) {
        this.langs.push(config.LANG)
        let { nluData, model } = loadOption(config.LANG, this.env)
        this.nlus[config.LANG] = {
          lang: config.LANG,
          model: model,
          nluData: nluData
        }
      }
      await Promise.all([
        ...Object.values(this.nlus).map(nlu => nlu.model),
        ...Object.values(this.nlus).map(nlu => nlu.nluData)
      ])
      let tagList = []
      let words = {}
      let tags = {}
      for (let [k, v] of Object.entries(this.nlus)) {
        let nluData = await v.nluData
        let { intentsDict, maxSeqLength, vocabulary, devEntities } =
          this.env.mode === 'node' ? nluData : nluData.data
        let model = await v.model
        let { lang } = v
        this.nlus[k] = {
          lang: lang,
          model: model,
          intents: intentsDict,
          maxSeqLength: maxSeqLength,
          tokenizer: new Tokenizer(vocabulary)
        }
        words = Object.assign(words, devEntities.words)
        tags = Object.assign(tags, devEntities.tags)
        tagList = tagList.concat(devEntities.tagList)
      }

      this.entities.words = words
      this.entities.tags = tags
      this.entities.tagList = tagList
      return this
    })()
  }

  predict(userInput, nlu) {
    let sequences = nlu.tokenizer.samplesToSequences(userInput)
    let predictions = sequences
      .map(sequence => padSequences([sequence], nlu.maxSeqLength).dataSync())
      .map(paddedSequence =>
        nlu.model.predict(tf.tensor([paddedSequence])).dataSync()
      )
    return predictions
  }

  getIntent(prediction, nlu) {
    let results = {}
    results.language = nlu.lang
    let maxScoreIdx = prediction.indexOf(Math.max(...prediction))
    results.intent = nlu.intents[maxScoreIdx]
    results.confidence = prediction[maxScoreIdx]
    results.intents = Array.from(prediction)
      .map((confidence, i) =>
        Object.create({ intent: `${nlu.intents[i]}`, confidence: confidence })
      )
      .sort((a, b) => b.confidence - a.confidence)
    return results
  }

  getIntents(userInputs) {
    let lang = detectLang(
      Array.isArray(userInputs) ? userInputs[0] : userInputs,
      this.langs
    )
    let nlu = this.nlus[lang]
    return this.predict(userInputs, nlu).map(prediction =>
      this.getIntent(prediction, nlu)
    )
  }

  getEntities(userInput) {
    return processEntities(userInput, this.entities)
  }
}
