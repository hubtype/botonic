import { tensor } from '@tensorflow/tfjs-node'

import { Sample } from '../../../dataset/input-data-parser'
import { LabelEncoder } from '../../../encode/label-encoder'
import { OneHotEncoder } from '../../../encode/one-hot-encoder'
import { PADDING_TOKEN, UNKNOWN_TOKEN } from '../../../preprocess/constants'
import { Preprocessor } from '../../../preprocess/preprocessor'
import { InputData, OutputData } from './types'

export class Processor {
  constructor(
    readonly preprocessor: Preprocessor,
    readonly tokensEncoder: LabelEncoder,
    readonly classEncoder: OneHotEncoder
  ) {}

  processSamples(samples: Sample[]): { x: InputData; y: OutputData } {
    const texts = samples.map(sample => sample.text)
    const classes = samples.map(sample => sample.class)

    return { x: this.processTexts(texts), y: this.generateOutput(classes) }
  }

  processTexts(texts: string[]): InputData {
    return tensor(texts.map(text => this.processText(text)))
  }

  private processText(text: string): number[] {
    const sequence = this.generateSequence(text)
    return this.tokensEncoder.encode(sequence)
  }

  private generateSequence(text: string): string[] {
    const sequence = this.preprocessor.preprocess(text, PADDING_TOKEN)
    return this.maskUnknownTokens(sequence)
  }

  private maskUnknownTokens(sequence: string[]): string[] {
    return sequence.map(token =>
      this.tokensEncoder.items.includes(token) ? token : UNKNOWN_TOKEN
    )
  }

  //TODO: modify encoders to just encode one token (not sequences).
  private generateOutput(classes: string[]): OutputData {
    return tensor(this.classEncoder.encode(classes))
  }
}
