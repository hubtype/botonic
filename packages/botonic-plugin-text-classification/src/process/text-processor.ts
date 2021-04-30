import { IndexedItems } from '@botonic/nlp/lib/encode/indexed-items'
import { LabelEncoder } from '@botonic/nlp/lib/encode/label-encoder'
import {
  PADDING_TOKEN,
  UNKNOWN_TOKEN,
} from '@botonic/nlp/lib/preprocess/constants'
import { Preprocessor } from '@botonic/nlp/lib/preprocess/preprocessor'
import { Tensor2D, tensor2d } from '@tensorflow/tfjs'

export class TextProcessor {
  private readonly encoder: LabelEncoder

  constructor(
    readonly vocabulary: string[],
    private readonly preprocessor: Preprocessor
  ) {
    this.encoder = new LabelEncoder(new IndexedItems(this.vocabulary))
  }

  process(text: string): { sequence: string[]; input: Tensor2D } {
    const sequence = this.preprocessor.preprocess(text, PADDING_TOKEN)
    const maskedSequence = this.encoder.items.maskUnknownItems(
      sequence,
      UNKNOWN_TOKEN
    )
    const encodedSequence = this.encoder.encode(maskedSequence)
    const input = tensor2d([encodedSequence])
    return { sequence, input }
  }
}
