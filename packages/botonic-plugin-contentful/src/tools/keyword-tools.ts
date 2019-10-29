import { CMS } from '../cms'
import { Locale, Normalizer } from '../nlp'

export class StemmedKeyword {
  constructor(readonly rawKeyword: string, readonly stemmedKeyword: string[]) {}

  toString(): string {
    return `${this.rawKeyword}: ${this.stemmedKeyword.toString()}`
  }
}

/**
 * Reports all the contents's stemmed keywords.
 * Useful to check if they're too short.
 */
export class KeywordsTool {
  constructor(
    readonly cms: CMS,
    readonly locale: Locale,
    readonly normalizer: Normalizer
  ) {}

  async dumpKeywords(): Promise<Map<string, StemmedKeyword[]>> {
    const keywords = new Map<string, StemmedKeyword[]>()
    const context = { locale: this.locale }
    const results = await this.cms.contentsWithKeywords(context)
    for (const res of results) {
      const stemmed = res.common.keywords.map(
        kw =>
          new StemmedKeyword(
            kw,
            this.normalizer.normalize(context.locale, kw).stems
          )
      )
      keywords.set(res.common.name, stemmed)
    }
    return keywords
  }
}
