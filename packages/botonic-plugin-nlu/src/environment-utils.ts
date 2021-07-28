import {
  ASSETS_DIR,
  MODEL_DATA_FILENAME,
  MODEL_FILENAME,
  MODELS_DIR,
} from '@botonic/nlu/lib/constants'
import { Language } from '@botonic/nlu/lib/language'
import { loadLayersModel } from '@tensorflow/tfjs'
import axios from 'axios'

import { ModelInformationPromises } from './types'

export const isProd = process.env.STATIC_URL !== undefined

export function getModelInfoFromEnv(lang: Language): ModelInformationPromises {
  let uri = ''
  if (isProd) {
    uri = `${process.env.STATIC_URL}/${ASSETS_DIR}/${MODELS_DIR}/`
  } else uri = window.location.href
  return {
    modelData: axios({
      url: `${uri}${lang}/${MODEL_DATA_FILENAME}`,
    }),
    model: loadLayersModel(`${uri}${lang}/${MODEL_FILENAME}`),
  }
}
