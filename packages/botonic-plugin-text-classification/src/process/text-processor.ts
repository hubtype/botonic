import { LabelEncoder } from '@botonic/nlp/lib/encode/label-encoder'
import {
  PADDING_TOKEN,
  UNKNOWN_TOKEN,
} from '@botonic/nlp/lib/preprocess/constants'
import { Preprocessor } from '@botonic/nlp/lib/preprocess/preprocessor'
import type { Tensor2D } from '@tensorflow/tfjs'
import { tensor } from '@tensorflow/tfjs'

export class TextProcessor {
  constructor(
    readonly vocabulary: string[],
    private readonly preprocessor: Preprocessor
  ) {}

  process(text: string): { sequence: string[]; input: Tensor2D } {
    const sequence = this.preprocessor.preprocess(text, PADDING_TOKEN)
    const maskedSequence = this.maskUnknownTokens(sequence)
    const encodedSequence = this.encodeSequence(maskedSequence)
    const input = tensor([encodedSequence]) as Tensor2D
    return { sequence, input }
  }

  private maskUnknownTokens(sequence: string[]): string[] {
    return sequence.map(token =>
      this.vocabulary.includes(token) ? token : UNKNOWN_TOKEN
    )
  }

  private encodeSequence(sequence: string[]): number[] {
    const encoder = new LabelEncoder(this.vocabulary)
    return encoder.encode(sequence)
  }
}
