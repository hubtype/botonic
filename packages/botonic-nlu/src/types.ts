import { Tensor } from '@tensorflow/tfjs-node'

import { Language } from './language'

/* Language Data */
export type Vocabulary = { [word: string]: number }

/* Word Embeddings */
export type WordEmbeddingType = '10k-fasttext' | 'glove'
export type WordEmbeddingDimension = 50 | 300
export interface WordEmbeddingsConfig {
  type: WordEmbeddingType
  dimension: WordEmbeddingDimension
  language: Language
  vocabulary: Vocabulary
}

/* Data preprocessing */
export interface Normalizer {
  normalize(text: string): string
}

export interface Stemmer {
  stem(text: string, language: Language): string
}

export interface Tokenizer {
  tokenize(text: string): string[]
}

export interface PreprocessorEngines {
  normalizer?: Normalizer
  tokenizer?: Tokenizer
  stemmer?: Stemmer
}

/* Sets */
export type DataSet = { label: string; feature: string }[]
export type InputSet = Tensor
export type OutputSet = Tensor

/* Intents codification */
export type IntentEncoder = { [intent: string]: number }
export type IntentDecoder = { [id: number]: string }
export type EncodedPrediction = { intentId: number; confidence: number }
export type DecodedPrediction = { intent: string; confidence: number }

/* Model Creation */
export interface ModelData {
  language: Language
  intents: IntentDecoder
  maxSeqLen: number
  vocabulary: Vocabulary
}

export interface ModelParameters {
  maxSeqLen: number
  learningRate: number
  intentsCount: number
  trainableEmbeddings: boolean
}

export enum ModelTemplatesType {
  SIMPLE_NN,
}

/* Model Training */
export interface TrainingParameters {
  x: InputSet
  y: OutputSet
  epochs: number
  batchSize: number
  validationSplit: number
}
