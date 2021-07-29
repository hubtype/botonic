import { Language } from '@botonic/nlu/lib/language'
import { Preprocessor } from '@botonic/nlu/lib/preprocessor'
import {
  ModelData,
  Normalizer,
  Stemmer,
  Tokenizer,
} from '@botonic/nlu/lib/types'
import { LayersModel } from '@tensorflow/tfjs'
import { AxiosPromise } from 'axios'

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
