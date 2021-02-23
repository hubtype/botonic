import { Sample } from '../../parser/types'
import { PADDING_TOKEN } from '../../preprocess/constants'
import { Preprocessor } from '../../preprocess/preprocessor'
import { SequencePosition } from '../../preprocess/types'
import { NEUTRAL_ENTITY } from './constants'

export class EntityRecognitionPreprocessor extends Preprocessor {
  preprocess(
    samples: Sample[],
    sequencePosition: SequencePosition = 'pre'
  ): { x: string[][]; y: string[][] } {
    const x: string[][] = []
    const y: string[][] = []

    samples.forEach(s => {
      const preprocessedSample = this.preprocessSample(s, sequencePosition)
      x.push(preprocessedSample.x)
      y.push(preprocessedSample.y)
    })

    return { x, y }
  }

  private preprocessSample(
    sample: Sample,
    sequencePosition: SequencePosition
  ): { x: string[]; y: string[] } {
    let x: string[] = []
    let y: string[] = []

    let start = 0
    sample.entities.forEach(e => {
      let text = sample.text.slice(start, e.start)
      let tokens = this.preprocessText(text)
      let entities = Array(tokens.length).fill(NEUTRAL_ENTITY)

      x = x.concat(tokens)
      y = y.concat(entities)

      text = e.text
      tokens = this.preprocessText(text)
      entities = Array(tokens.length).fill(e.label)

      x = x.concat(tokens)
      y = y.concat(entities)

      start = e.end
    })

    const text = sample.text.slice(start)
    const tokens = this.preprocessText(text)
    const entities = Array(tokens.length).fill(NEUTRAL_ENTITY)

    x = x.concat(tokens)
    y = y.concat(entities)

    x = this.truncate(x, sequencePosition)
    x = this.pad(x, sequencePosition, PADDING_TOKEN)

    y = this.truncate(y, sequencePosition)
    y = this.pad(y, sequencePosition, NEUTRAL_ENTITY)

    return { x, y }
  }

  private preprocessText(text: string): string[] {
    return this.stem(this.removeStopwords(this.tokenize(this.normalize(text))))
  }
}
