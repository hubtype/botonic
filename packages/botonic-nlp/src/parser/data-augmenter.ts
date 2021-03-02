/* eslint-disable @typescript-eslint/naming-convention */
import { AugmenterMap } from './types'

export class DataAugmenter {
  // eslint-disable-next-line no-useless-escape
  private static readonly KEYWORD_PATTERN = /(\[([^\[\]\(\)]*?)\])(?:[^\(]|$)/

  static augment(
    sentences: string[],
    augmenter: AugmenterMap,
    entities: string[]
  ): string[] {
    let augmentedSamples: string[] = []
    sentences.forEach(sample => {
      const variations = DataAugmenter.generateVariations(
        sample,
        augmenter,
        entities
      )
      augmentedSamples = augmentedSamples.concat(variations)
    })
    return augmentedSamples
  }

  private static generateVariations(
    sample: string,
    augmenter: AugmenterMap,
    entities: string[]
  ): string[] {
    const inprocessSamples = [sample]
    const variations: string[] = []

    while (inprocessSamples.length > 0) {
      const tmpSample = inprocessSamples.pop() as string
      const match = DataAugmenter.KEYWORD_PATTERN.exec(tmpSample)
      if (match) {
        const keyword = match[2]
        if (keyword in augmenter) {
          const isEntity = entities.includes(keyword)
          augmenter[keyword].forEach(word => {
            const replacement = isEntity ? `[${word}](${keyword})` : word
            const variation = tmpSample
              .slice(0, match.index)
              .concat(
                replacement,
                tmpSample.slice(match.index + match[1].length)
              )
            inprocessSamples.push(variation)
          })
        } else {
          throw new Error(
            `Unable to augment the data. Undefined keyword: ${keyword}`
          )
        }
      } else {
        variations.push(tmpSample)
      }
    }
    return variations
  }
}
