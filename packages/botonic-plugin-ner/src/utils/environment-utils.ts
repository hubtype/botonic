import { loadLayersModel } from '@tensorflow/tfjs'
import axios from 'axios'

import {
  ASSETS_DIR,
  CONFIG_FILENAME,
  MODEL_DIR,
  MODEL_FILENAME,
  MODELS_DIR,
  NER_DIR,
} from '../constants'
import { ModelInfo } from '../types'

export async function getModelInfo(): Promise<ModelInfo> {
  const isProd = process.env.STATIC_URL !== undefined
  const domain = isProd ? process.env.STATIC_URL : window.location.href
  const uri = isProd
    ? `${domain}/${ASSETS_DIR}/${MODELS_DIR}/${NER_DIR}`
    : `${domain}/${NER_DIR}/${MODEL_DIR}`
  return {
    config: (await axios({ url: `${uri}/${CONFIG_FILENAME}` })).data,
    model: await loadLayersModel(`${uri}/${MODEL_FILENAME}`),
  }
}
