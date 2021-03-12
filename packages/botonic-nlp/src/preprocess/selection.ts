import { Sample } from '../dataset/types'

export function trainTestSplit(
  samples: Sample[],
  testSize: number,
  shuffle = true
): { trainSet: Sample[]; testSet: Sample[] } {
  if (1 < testSize || testSize < 0) {
    throw new RangeError(`testsize must be a number between 0 and 1.`)
  }
  if (shuffle) {
    samples = samples.sort(() => Math.random() - 0.5)
  }
  return {
    trainSet: samples.slice(testSize * samples.length),
    testSet: samples.slice(0, testSize * samples.length),
  }
}
