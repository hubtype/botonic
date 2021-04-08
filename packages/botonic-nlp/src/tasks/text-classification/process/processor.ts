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
    const processedSamples = samples.map(s => this.processSample(s))
    return {
      x: tensor(processedSamples.map(s => s.x)),
      y: tensor(processedSamples.map(s => s.y)),
    }
  }

  private processSample(sample: Sample): { x: number[]; y: number[] } {
    return {
      x: this.generateSampleInput(sample.text),
      y: this.generateSampleOutput(sample.class),
    }
  }

  private generateSampleInput(text: string): number[] {
    const sequence = this.generateSequence(text)
    return this.tokensEncoder.encode(sequence)
  }

  private generateSequence(text: string): string[] {
    const normalizedText = this.preprocessor.normalize(text)
    const sequence = this.preprocessor.tokenize(normalizedText)
    const filteredSequence = this.preprocessor.removeStopwords(sequence)
    const stemmedSequence = this.preprocessor.stem(filteredSequence)
    const maskedSequence = this.maskUnknownTokens(stemmedSequence)
    const paddedSequence = this.preprocessor.pad(maskedSequence, PADDING_TOKEN)
    return paddedSequence
  }

  private maskUnknownTokens(sequence: string[]): string[] {
    return sequence.map(token =>
      this.tokensEncoder.vocabulary.includes(token) ? token : UNKNOWN_TOKEN
    )
  }

  //TODO: modify encoders to just encode one token (not sequences).
  private generateSampleOutput(className: string): number[] {
    return this.classEncoder.encode([className])[0]
  }

  generateInput(text: string): InputData {
    return tensor([this.generateSampleInput(text)])
  }
}
