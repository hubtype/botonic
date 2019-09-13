import axios from 'axios'
import * as tf from '@tensorflow/tfjs'
import {
  ASSETS_DIRNAME,
  MODELS_DIRNAME,
  NLU_DATA_FILENAME,
  MODEL_FILENAME
} from '@botonic/nlu/lib/constants'

export const isProd = () => {
  return process.env.STATIC_URL !== undefined
}

export async function resolveEnv() {
  if (isProd()) {
    return {
      mode: 'prod',
      uri: `${process.env.STATIC_URL}/${ASSETS_DIRNAME}/${MODELS_DIRNAME}/`
    }
  } else {
    return { mode: 'dev', uri: window.location.href }
  }
}

export function loadOption(lang, env) {
  let nlu = {}
  try {
    nlu.nluData = axios({
      url: `${env.uri}${lang}/${NLU_DATA_FILENAME}`
    })
    nlu.model = tf.loadLayersModel(`${env.uri}${lang}/${MODEL_FILENAME}`)
  } catch (e) {
    console.log('Cannot retrieve NLU Information', e)
  }
  return nlu
}
