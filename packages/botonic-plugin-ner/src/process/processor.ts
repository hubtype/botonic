import { Codifier } from '@botonic/nlp/dist/preprocess/codifier'
import {
  PADDING_TOKEN,
  UNKNOWN_TOKEN,
} from '@botonic/nlp/dist/preprocess/constants'
import { Preprocessor } from '@botonic/nlp/dist/preprocess/preprocessor'
import { tensor } from '@tensorflow/tfjs-core/dist/ops/tensor'
import { Tensor2D } from '@tensorflow/tfjs-core/dist/tensor'

export class Processor {
  constructor(
    readonly preprocessor: Preprocessor,
    readonly tokenCodifier: Codifier,
    readonly entityCodifier: Codifier
  ) {}

  generateInput(text: string): { sequence: string[]; input: Tensor2D } {
    const sequence = this.processText(text)
    const input = tensor([this.processTokens(sequence)]) as Tensor2D
    return { sequence, input }
  }

  private processText(text: string): string[] {
    return this.preprocessor.pad(
      this.preprocessor.stem(
        this.preprocessor.removeStopwords(
          this.preprocessor.tokenize(this.preprocessor.normalize(text))
        )
      ),
      PADDING_TOKEN
    )
  }

  private maskUnknownTokens(tokens: string[]): string[] {
    return tokens.map(t =>
      this.tokenCodifier.vocabulary.includes(t) ? t : UNKNOWN_TOKEN
    )
  }

  private processTokens(sequence: string[]): number[] {
    return this.tokenCodifier.encode(
      this.maskUnknownTokens(sequence)
    ) as number[]
  }
}
