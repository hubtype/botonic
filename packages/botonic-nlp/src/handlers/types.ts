import { Locale } from '../types'

export type ModelEvaluation = { loss: number; accuracy: number }

export type ModelConfig = {
  locale: Locale
  maxLength: number
  vocabulary: string[]
}
