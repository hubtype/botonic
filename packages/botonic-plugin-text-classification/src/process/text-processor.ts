import { Preprocessor } from '@botonic/nlp/lib/preprocess/preprocessor'
import type { Tensor2D } from '@tensorflow/tfjs'

export class TextProcessor {
  constructor(
    readonly vocabulary: string[],
    private readonly preprocessor: Preprocessor
  ) {}

  process(text: string): { sequence: string[]; input: Tensor2D } {
    //TODO: pending to be implemented
    return { sequence: null, input: null }
  }
}
