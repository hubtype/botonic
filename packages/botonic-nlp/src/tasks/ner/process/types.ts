import { Tensor2D, Tensor3D } from '@tensorflow/tfjs-node'

export type InputData = Tensor2D
export type OutputData = Tensor3D

export type Prediction = { label: string; confidence: number }
export type Entity = {
  text: string
  label: string
  confidence: number
  predictions: Prediction[]
}
