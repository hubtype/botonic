import {
  Tokenizer,
  Normalizer,
  Stemmer,
  ModelData,
} from '@botonic/nlu/dist/types'
import { Language } from '@botonic/nlu/dist/language'
import { Preprocessor } from '@botonic/nlu/dist/preprocessor'
import { LayersModel, Sequential } from '@tensorflow/tfjs'

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
    model?: Sequential | LayersModel
    modelData?: ModelData
    language?: Language
    preprocessor?: Preprocessor
  }
}

export interface IntentResult {
  intent: string
  confidence: number
}

export interface Result {
  intents: IntentResult[]
  intent: string
  confidence: number
  language: Language
}
