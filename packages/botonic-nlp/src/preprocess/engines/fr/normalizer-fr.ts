import { Normalizer } from '../../types'

export class NormalizerFr implements Normalizer {
  readonly locale = 'fr'
  private normalizer = new (require('@nlpjs/lang-fr/src/normalizer-fr'))()

  normalize(text: string): string {
    return this.normalizer.normalize(text)
  }
}
