import { tensor, Tensor2D } from '@tensorflow/tfjs-node'

import { Codifier } from '../preprocess/codifier'
import { PADDING_TOKEN, UNKNOWN_TOKEN } from '../preprocess/constants'
import { Preprocessor } from '../preprocess/preprocessor'

export class SampleProcessor {
  constructor(
    protected readonly preprocessor: Preprocessor,
    protected readonly sequenceCodifier: Codifier
  ) {}

  processInput(text: string): { sequence: string[]; input: Tensor2D } {
    const sequence = this.preprocessor.pad(
      this.processText(text),
      PADDING_TOKEN
    )
    const input = tensor([this.processSequence(sequence)]) as Tensor2D
    return { sequence, input }
  }

  protected processText(text: string): string[] {
    return this.preprocessor.stem(
      this.preprocessor.removeStopwords(
        this.preprocessor.tokenize(this.preprocessor.normalize(text))
      )
    )
  }

  protected maskUnknownTokens(tokens: string[]): string[] {
    return tokens.map(t =>
      this.sequenceCodifier.vocabulary.includes(t) ? t : UNKNOWN_TOKEN
    )
  }

  protected processSequence(sequence: string[]): number[] {
    return this.sequenceCodifier.encode(
      this.preprocessor.pad(this.maskUnknownTokens(sequence), PADDING_TOKEN)
    ) as number[]
  }
}
