import { tensor, Tensor2D } from '@tensorflow/tfjs-node'

import { Sample } from '../../../dataset/types'
import { Codifier } from '../../../preprocess/codifier'
import { PADDING_TOKEN, UNKNOWN_TOKEN } from '../../../preprocess/constants'
import { Preprocessor } from '../../../preprocess/preprocessor'
import { NEUTRAL_ENTITY } from './constants'
import { InputData, OutputData } from './types'

export class Processor {
  constructor(
    public preprocessor: Preprocessor,
    readonly tokenCodifier: Codifier,
    readonly entityCodifier: Codifier
  ) {}

  // Processes samples and generates the Input and Output data.
  process(samples: Sample[]): { x: InputData; y: OutputData } {
    const processedSamples = samples.map(s => this.processSample(s))
    return {
      x: tensor(processedSamples.map(s => s.x)),
      y: tensor(processedSamples.map(s => s.y)),
    }
  }

  // Generates the Input data and the unmasked sequence.
  generateInput(text: string): { sequence: string[]; input: InputData } {
    const sequence = this.processText(text)
    const input = tensor([this.processTokens(sequence)]) as Tensor2D
    return { sequence, input }
  }

  private processSample(sample: Sample): { x: number[]; y: number[][] } {
    let tokens: string[] = []
    let entities: string[] = []

    let start = 0
    let partialSequence: string[]
    let partialEntities: string[]

    sample.entities.forEach(e => {
      let text = sample.text.slice(start, e.start)
      partialSequence = this.processText(text)
      partialEntities = Array(partialSequence.length).fill(NEUTRAL_ENTITY)

      tokens = tokens.concat(partialSequence)
      entities = entities.concat(partialEntities)

      text = e.text
      partialSequence = this.processText(text)
      partialEntities = Array(partialSequence.length).fill(e.label)

      tokens = tokens.concat(partialSequence)
      entities = entities.concat(partialEntities)

      start = e.end
    })

    const text = sample.text.slice(start)
    partialSequence = this.processText(text)
    partialEntities = Array(partialSequence.length).fill(NEUTRAL_ENTITY)

    tokens = tokens.concat(partialSequence)
    entities = entities.concat(partialEntities)

    return {
      x: this.processTokens(tokens),
      y: this.processEntities(entities),
    }
  }

  private processText(text: string): string[] {
    return this.preprocessor.stem(
      this.preprocessor.removeStopwords(
        this.preprocessor.tokenize(this.preprocessor.normalize(text))
      )
    )
  }

  private maskUnknownTokens(tokens: string[]): string[] {
    return tokens.map(t =>
      this.tokenCodifier.vocabulary.includes(t) ? t : UNKNOWN_TOKEN
    )
  }

  private processTokens(sequence: string[]): number[] {
    return this.tokenCodifier.encode(
      this.preprocessor.pad(this.maskUnknownTokens(sequence), PADDING_TOKEN)
    ) as number[]
  }

  private processEntities(sequence: string[]): number[][] {
    return this.entityCodifier.encode(
      this.preprocessor.pad(sequence, NEUTRAL_ENTITY)
    ) as number[][]
  }
}
