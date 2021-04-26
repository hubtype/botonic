import { Locale } from '@botonic/nlp/lib/types'

import { TextClassifier } from './text-classifier'

export class ModelSelector {
  private constructor(readonly locales: Locale[]) {}

  static async build(locales: Locale[]): Promise<ModelSelector> {
    return new ModelSelector(locales)
  }

  select(locale: Locale): TextClassifier {
    return null
  }
}
