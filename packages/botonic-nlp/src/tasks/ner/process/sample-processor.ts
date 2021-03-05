import { tensor } from '@tensorflow/tfjs-node'

import { Sample } from '../../../parser/types'
import { Codifier } from '../../../preprocess/codifier'
import { Preprocessor } from '../../../preprocess/preprocessor'
import { SampleProcessor } from '../../../process/sample-processor'
import { NEUTRAL_ENTITY } from './constants'
import { Set } from './types'

export class NerSampleProcessor extends SampleProcessor {
  constructor(
    preprocessor: Preprocessor,
    sequenceCodifier: Codifier,
    private readonly entitiesCodifier: Codifier
  ) {
    super(preprocessor, sequenceCodifier)
  }

  process(samples: Sample[]): Set {
    const processedSamples = samples.map(s => this.processSample(s))
    return {
      x: tensor(processedSamples.map(s => s.x)),
      y: tensor(processedSamples.map(s => s.y)),
    }
  }

  private processSample(sample: Sample): { x: number[]; y: number[][] } {
    let x: string[] = []
    let y: string[] = []

    let start = 0
    let partialSequence: string[]
    let partialEntities: string[]

    sample.entities.forEach(e => {
      let text = sample.text.slice(start, e.start)
      partialSequence = this.processText(text)
      partialEntities = Array(partialSequence.length).fill(NEUTRAL_ENTITY)

      x = x.concat(partialSequence)
      y = y.concat(partialEntities)

      text = e.text
      partialSequence = this.processText(text)
      partialEntities = Array(partialSequence.length).fill(e.label)

      x = x.concat(partialSequence)
      y = y.concat(partialEntities)

      start = e.end
    })

    const text = sample.text.slice(start)
    partialSequence = this.processText(text)
    partialEntities = Array(partialSequence.length).fill(NEUTRAL_ENTITY)

    x = x.concat(partialSequence)
    y = y.concat(partialEntities)

    return { x: this.processSequence(x), y: this.processEntities(y) }
  }

  private processEntities(sequence: string[]): number[][] {
    return this.entitiesCodifier.encode(
      this.preprocessor.pad(sequence, NEUTRAL_ENTITY)
    ) as number[][]
  }
}
