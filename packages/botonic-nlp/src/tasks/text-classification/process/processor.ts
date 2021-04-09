import { tensor } from '@tensorflow/tfjs-node'

import { Sample } from '../../../dataset/types'
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

  process(samples: Sample[]): { x: InputData; y: OutputData } {
    const texts = samples.map(sample => sample.text)
    const classes = samples.map(sample => sample.class)

    return { x: this.generateInput(texts), y: this.generateOutput(classes) }
  }

  generateInput(texts: string[]): InputData {
    return tensor(texts.map(text => this.processText(text)))
  }

  private processText(text: string): number[] {
    const sequence = this.generateSequence(text)
    return this.tokensEncoder.encode(sequence)
  }

  private generateSequence(text: string): string[] {
    const normalizedText = this.preprocessor.normalize(text)
    const sequence = this.preprocessor.tokenize(normalizedText)
    const filteredSequence = this.preprocessor.removeStopwords(sequence)
    const stemmedSequence = this.preprocessor.stem(filteredSequence)
    const paddedSequence = this.preprocessor.pad(stemmedSequence, PADDING_TOKEN)
    const maskedSequence = this.maskUnknownTokens(paddedSequence)
    return maskedSequence
  }

  private maskUnknownTokens(sequence: string[]): string[] {
    return sequence.map(token =>
      this.tokensEncoder.vocabulary.includes(token) ? token : UNKNOWN_TOKEN
    )
  }

  //TODO: modify encoders to just encode one token (not sequences).
  private generateOutput(classes: string[]): OutputData {
    return tensor(this.classEncoder.encode(classes))
  }
}
