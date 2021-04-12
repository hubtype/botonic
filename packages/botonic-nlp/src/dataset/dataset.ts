import { randomSort } from '../utils/array-utils'
import { DatasetLoader } from './loader'
import { Sample } from './types'

export class Dataset {
  constructor(
    readonly classes: string[],
    readonly entities: string[],
    readonly samples: Sample[]
  ) {}

  static load(path: string): Dataset {
    const { classes, entities, samples } = DatasetLoader.load(path)
    return new Dataset(classes, entities, samples)
  }

  split(
    testProportion = 0.2,
    shuffle = true
  ): { trainSet: Dataset; testSet: Dataset } {
    if (1 < testProportion || testProportion < 0) {
      throw new RangeError(`testsize must be a number between 0 and 1.`)
    }
    const samples = shuffle ? randomSort(this.samples) : this.samples
    const trainSamples = samples.slice(testProportion * samples.length)
    const testSamples = samples.slice(0, testProportion * samples.length)
    return {
      trainSet: new Dataset(this.classes, this.entities, trainSamples),
      testSet: new Dataset(this.classes, this.entities, testSamples),
    }
  }

  get length(): number {
    return this.samples.length
  }
}
