import { Normalizer } from '../../types'

export class NormalizerEn implements Normalizer {
  readonly locale = 'en'
  private normalizer = new (require('@nlpjs/lang-en-min/src/normalizer-en'))()

  normalize(text: string): string {
    return this.normalizer.normalize(text)
  }
}
