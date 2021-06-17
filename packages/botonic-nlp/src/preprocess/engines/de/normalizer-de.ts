import { Normalizer } from '../../types'

export class NormalizerDe implements Normalizer {
  readonly locale = 'de'
  private normalizer = new (require('@nlpjs/lang-de/src/normalizer-de'))()

  normalize(text: string): string {
    return this.normalizer.normalize(text)
  }
}
