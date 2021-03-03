/* eslint-disable @typescript-eslint/naming-convention */
import { AugmenterMap } from './types'

export class DataAugmenter {
  // eslint-disable-next-line no-useless-escape
  private readonly KEYWORD_PATTERN = /(\[([^\[\]\(\)]*?)\])(?:[^\(]|$)/

  constructor(readonly augmenter: AugmenterMap, readonly entities: string[]) {}

  augment(sentences: string[]): string[] {
    let augmentedSentences: string[] = []
    sentences.forEach(s => {
      augmentedSentences = augmentedSentences.concat(this.augmentSentence(s))
    })
    return augmentedSentences
  }

  private augmentSentence(sentence: string): string[] {
    const finalSentences: string[] = []
    let unprocessedSentences: string[] = [sentence]
    while (unprocessedSentences.length > 0) {
      const processedSentence = unprocessedSentences.pop()
      const variations = this.generateVariations(processedSentence)
      if (variations.length == 0) {
        finalSentences.push(processedSentence)
      } else {
        unprocessedSentences = unprocessedSentences.concat(variations)
      }
    }
    return finalSentences
  }

  private generateVariations(sentence: string): string[] {
    const match = this.KEYWORD_PATTERN.exec(sentence)
    if (match) {
      const keyword = match[2]
      if (keyword in this.augmenter) {
        return this.augmenter[keyword].map(word =>
          this.createVariation(sentence, word, match)
        )
      } else {
        throw new Error(
          `Unable to augment the data. Undefined keyword: ${keyword}`
        )
      }
    }
    return []
  }

  private createVariation(
    sentence: string,
    word: string,
    match: RegExpExecArray
  ): string {
    return sentence
      .slice(0, match.index)
      .concat(
        this.entities.includes(match[2]) ? `[${word}](${match[2]})` : word,
        sentence.slice(match.index + match[1].length)
      )
  }
}
