import { Normalizer } from '../../types'

export class NormalizerIt implements Normalizer {
  readonly locale = 'it'
  private normalizer = new (require('@nlpjs/lang-it/src/normalizer-it'))()

  normalize(text: string): string {
    return this.normalizer.normalize(text)
  }
}
