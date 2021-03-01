import { Tensor2D, Tensor3D } from '@tensorflow/tfjs-node'

export type Set = { x: Tensor2D; y: Tensor3D }

export type Prediction = { label: string; confidence: number }
export type Entity = {
  text: string
  label: string
  confidence: number
  predictions: Prediction[]
}
