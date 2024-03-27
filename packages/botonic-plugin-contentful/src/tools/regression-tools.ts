import { Locale, MatchType } from '../nlp'
import BotonicPluginContentful from '../plugin'

export type SearchEvaluator = (
  /** Starting with 0. Undefined if not found */
  matchPosition: number | undefined,
  numResults: number
) => number

export class GroundTruth {
  constructor(
    readonly utterance: string,
    readonly contentId: string
  ) {}
}

export class SearchRegression {
  constructor(
    readonly plugin: BotonicPluginContentful,
    readonly evaluator: SearchEvaluator
  ) {}

  async run(
    matchType: MatchType,
    groundTruths: Iterable<GroundTruth>,
    locale: Locale
  ): Promise<number> {
    let sumEvals = 0
    let count = 0
    for (const gt of groundTruths) {
      count++
      const res = await this.plugin.search.searchByKeywords(
        gt.utterance,
        matchType,
        { locale }
      )
      const pos = res.findIndex(res => res.contentId.id == gt.contentId)
      sumEvals += this.evaluator(pos >= 0 ? pos : undefined, res.length)
    }
    return sumEvals / count
  }
}
