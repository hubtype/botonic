import { Codifier } from '@botonic/nlp/lib/preprocess/codifier'
import {
  PADDING_TOKEN,
  UNKNOWN_TOKEN,
} from '@botonic/nlp/lib/preprocess/constants'
import { Preprocessor } from '@botonic/nlp/lib/preprocess/preprocessor'
import { tensor, Tensor2D } from '@tensorflow/tfjs'

export class TextProcessor {
  constructor(
    readonly vocabulary: string[],
    readonly preprocessor: Preprocessor
  ) {}

  process(text: string): { sequence: string[]; input: Tensor2D } {
    const sequence = this.generateSequence(text)
    const maskedSequence = this.maskUnknownTokens(sequence)
    const encodedSequence = this.encodeSequence(maskedSequence)
    const input = tensor([encodedSequence]) as Tensor2D
    return { sequence, input }
  }

  private generateSequence(text: string): string[] {
    const normalizedMessage = this.preprocessor.normalize(text)
    let sequence = this.preprocessor.tokenize(normalizedMessage)
    sequence = this.preprocessor.removeStopwords(sequence)
    sequence = this.preprocessor.stem(sequence)
    return this.preprocessor.pad(sequence, PADDING_TOKEN)
  }

  private maskUnknownTokens(sequence: string[]): string[] {
    return sequence.map(token =>
      this.vocabulary.includes(token) ? token : UNKNOWN_TOKEN
    )
  }

  private encodeSequence(sequence: string[]): number[] {
    const codifier = new Codifier(this.vocabulary, { isCategorical: false })
    return codifier.encode(sequence) as number[]
  }
}
