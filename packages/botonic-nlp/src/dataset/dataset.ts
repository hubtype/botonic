import { Preprocessor } from '../preprocess'
import { PADDING_TOKEN, UNKNOWN_TOKEN } from '../preprocess/constants'
import { flatten, shuffle as shuffleArray, unique } from '../utils/array-utils'
import { InputDataParser, Sample } from './input-data-parser'
import { InputDataReader } from './input-data-reader'

export class Dataset {
  private constructor(
    readonly classes: string[],
    readonly entities: string[],
    readonly samples: Sample[]
  ) {}

  static load(path: string): Dataset {
    const inputData = new InputDataReader(path).read()
    const { classes, entities, samples } = new InputDataParser().parse(
      inputData
    )
    return new Dataset(classes, entities, samples)
  }

  split(
    testProportion = 0.2,
    shuffle = true
  ): { trainSet: Dataset; testSet: Dataset } {
    if (1 < testProportion || testProportion < 0) {
      throw new RangeError(`testProportion must be a number between 0 and 1.`)
    }
    const samples = shuffle ? shuffleArray(this.samples) : this.samples
    const trainSamples = samples.slice(testProportion * samples.length)
    const testSamples = samples.slice(0, testProportion * samples.length)
    return {
      trainSet: new Dataset(this.classes, this.entities, trainSamples),
      testSet: new Dataset(this.classes, this.entities, testSamples),
    }
  }

  extractVocabulary(preprocessor: Preprocessor): string[] {
    const sequences = this.samples.map(sample =>
      preprocessor.preprocess(sample.text, PADDING_TOKEN)
    )
    const datasetTokens = flatten(sequences)
    const tokens = [PADDING_TOKEN, UNKNOWN_TOKEN].concat(datasetTokens)
    return unique(tokens)
  }

  get length(): number {
    return this.samples.length
  }
}
