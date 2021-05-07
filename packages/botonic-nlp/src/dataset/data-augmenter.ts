/* eslint-disable @typescript-eslint/naming-convention */

export type AugmenterMap = { [keyword: string]: string[] }

export class DataAugmenter {
  // eslint-disable-next-line no-useless-escape
  private readonly KEYWORD_PATTERN = /(\[([^\[\]\(\)]*?)\])(?:[^\(]|$)/

  constructor(readonly augmenter: AugmenterMap, readonly entities: string[]) {}

  augment(sentences: string[]): string[] {
    return sentences
      .map(s => this.augmentSentence(s))
      .reduce(
        (augmentedSentences, augmentations) =>
          augmentedSentences.concat(augmentations),
        []
      )
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
      const start = match.index
      const definition = match[1]
      const keyword = match[2]
      if (keyword in this.augmenter) {
        return this.augmenter[keyword].map(word =>
          this.createVariation(sentence, word, start, definition, keyword)
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
    start: number,
    definition: string,
    keyword: string
  ): string {
    return sentence
      .slice(0, start)
      .concat(
        this.entities.includes(keyword) ? `[${word}](${keyword})` : word,
        sentence.slice(start + definition.length)
      )
  }
}
