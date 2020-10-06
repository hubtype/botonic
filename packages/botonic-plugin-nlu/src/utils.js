import axios from 'axios'
import * as tf from '@tensorflow/tfjs'
import * as CONSTANTS from '@botonic/nlu/dist/constants'

export const isProd = () => {
  return process.env.STATIC_URL !== undefined
}

export async function resolveEnv() {
  if (isProd()) {
    return {
      mode: 'prod',
      uri: `${process.env.STATIC_URL}/${CONSTANTS.ASSETS_DIR}/${CONSTANTS.MODELS_DIR}/`,
    }
  } else {
    return { mode: 'dev', uri: window.location.href }
  }
}

export function loadOption(lang, env) {
  const nlu = {}
  try {
    nlu.nluData = axios({
      url: `${env.uri}${lang}/${CONSTANTS.MODEL_DATA_FILENAME}`,
    })
    nlu.model = tf.loadLayersModel(
      `${env.uri}${lang}/${CONSTANTS.MODEL_FILENAME}`
    )
  } catch (e) {
    console.log('Cannot retrieve NLU Information', e)
  }
  return nlu
}
