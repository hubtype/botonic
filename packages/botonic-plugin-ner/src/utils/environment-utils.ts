import { Locale } from '@botonic/nlp/dist/types'
import { loadLayersModel } from '@tensorflow/tfjs'
import axios from 'axios'

import {
  ASSETS_DIR,
  CONFIG_FILENAME,
  MODEL_FILENAME,
  MODELS_DIR,
  NER_DIR,
} from '../constants'
import { ModelInfo } from '../types'

export async function getModelInfo(locale: Locale): Promise<ModelInfo> {
  const isProd = process.env.STATIC_URL !== undefined
  const domain = isProd ? process.env.STATIC_URL : window.location.href
  const uri = isProd
    ? `${domain}/${ASSETS_DIR}/${MODELS_DIR}/${NER_DIR}/${locale}`
    : `${domain}/${NER_DIR}/${MODELS_DIR}/${locale}`
  return {
    config: (await axios({ url: `${uri}/${CONFIG_FILENAME}` })).data,
    model: await loadLayersModel(`${uri}/${MODEL_FILENAME}`),
  }
}
