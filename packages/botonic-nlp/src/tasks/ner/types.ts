import { Tensor2D, Tensor3D } from '@tensorflow/tfjs-node'

import { Locale } from '../../types'

export type Set = { x: Tensor2D; y: Tensor3D }

export type Prediction = { confidence: number; label: string }
export type Entity = {
  text: string
  label: string
  confidence: number
  predictions?: Prediction[]
}

export type ModelTemplate = 'biLstm'
export type ModelConfig = {
  locale: Locale
  maxLength: number
  vocabulary: string[]
  entities: string[]
}
