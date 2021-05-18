import { Preprocessor } from '../preprocess'
import { Locale } from '../types'

export interface NlpTaskConfig {
  locale: Locale
  maxLength: number
  vocabulary: string[]
  preprocessor: Preprocessor
}
