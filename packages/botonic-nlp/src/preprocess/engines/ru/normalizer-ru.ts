import { Normalizer } from '../../types'

export class NormalizerRu implements Normalizer {
  readonly locale = 'ru'
  private normalizer = new (require('@nlpjs/lang-ru/src/normalizer-ru'))()

  normalize(text: string): string {
    return this.normalizer.normalize(text)
  }
}
