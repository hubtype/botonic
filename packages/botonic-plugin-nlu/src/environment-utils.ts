import axios from 'axios'
import { loadLayersModel } from '@tensorflow/tfjs'
import {
  ASSETS_DIR,
  MODELS_DIR,
  MODEL_DATA_FILENAME,
  MODEL_FILENAME,
} from '@botonic/nlu/dist/constants'
import { Language } from '@botonic/nlu/dist/language'

export const isProd = process.env.STATIC_URL !== undefined

export function getModelInfoForEnv(lang: Language): any {
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
