import axios from 'axios'
import * as tf from '@tensorflow/tfjs'
import { default as fetch } from 'node-fetch'
import path from 'path'
import { readFile } from './fileUtils'
import { Tokenizer, padSequences, detectLang } from './preprocessing'
import { processEntities } from './ner'
import {
  NLU_DATA_FILENAME,
  MODEL_FILENAME,
  MODELS_DIRNAME,
  NLU_PATH,
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
      uri: `${path.join(process.cwd(), NLU_PATH, MODELS_DIRNAME)}/`
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
      nlu.nluData = JSON.parse(
        readFile(`${env.uri}/${lang}/${NLU_DATA_FILENAME}`)
      )
      nlu.model = tf.loadLayersModel(
        `file://${env.uri}${lang}/${MODEL_FILENAME}`
      )
    }
  } catch (e) {
    console.log('Cannot retrieve NLU Information')
  }
  return nlu
}

export class NLU {
  constructor(options) {
    return (async () => {
      this.env = await resolveEnv()
      this.langs = []
      this.nlus = {}
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
      for (let [k, v] of Object.entries(this.nlus)) {
        let nluData = await v.nluData
        let { intentsDict, maxSeqLength, vocabulary } =
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
      }
      return this
    })()
  }

  predict(userInput, nlu) {
    let sequences = nlu.tokenizer.samplesToSequences(userInput)
    let paddedSequences = []
    for (let s = 0, len = sequences.length; s < len; s++) {
      paddedSequences.push(
        padSequences([sequences[s]], nlu.maxSeqLength).dataSync()
      )
    }
    let predictions = []
    for (let ps = 0, len = paddedSequences.length; ps < len; ps++) {
      predictions.push(
        nlu.model.predict(tf.tensor([paddedSequences[ps]])).dataSync()
      )
    }
    return predictions
  }

  getIntent(prediction, nlu) {
    let results = {}
    results.intents = []
    prediction.map((prob, i) => {
      let res = {}
      res['intent'] = `${nlu.intents[i]}`
      res['prob'] = prob
      results.intents.push(res)
    })
    let index = prediction.indexOf(Math.max(...prediction))
    results.intent = nlu.intents[index]
    results.confidence = prediction[index]
    results.language = nlu.lang
    return results
  }

  getIntents(userInput) {
    let lang = detectLang(userInput, this.langs)
    let nlu = this.nlus[lang]
    let predictions = this.predict(userInput, nlu)
    let results = []
    for (let p = 0, len = predictions.length; p < len; p++) {
      results.push(this.getIntent(predictions[p], nlu))
    }
    if (results.length == 1) {
      results[0].intents.sort((a, b) => b.prob - a.prob)
      return results[0]
    }
    return results
  }

  getEntities(userInput) {
    return processEntities(userInput)
  }
}
