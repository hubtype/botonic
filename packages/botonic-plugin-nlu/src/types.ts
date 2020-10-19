import { AxiosPromise } from 'axios'
import {
  Tokenizer,
  Normalizer,
  Stemmer,
  ModelData,
} from '@botonic/nlu/dist/types'
import { Language } from '@botonic/nlu/dist/language'
import { Preprocessor } from '@botonic/nlu/dist/preprocessor'
import { LayersModel } from '@tensorflow/tfjs'

export interface PreprocessingOptions {
  tokenizer?: Tokenizer
  normalizer?: Normalizer
  stemmer?: Stemmer
}

export interface BotonicPluginNLUOptions {
  [language: string]: PreprocessingOptions
}

export interface ModelInformation {
  [language: string]: {
    model?: LayersModel
    modelData?: ModelData
    language?: Language
    preprocessor?: Preprocessor
  }
}

export interface ModelInformationPromises {
  modelData: AxiosPromise<ModelData>
  model: Promise<LayersModel>
}
