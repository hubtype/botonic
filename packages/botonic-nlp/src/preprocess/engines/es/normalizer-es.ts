import { Normalizer } from '../../types'

export class NormalizerEs implements Normalizer {
  readonly locale = 'es'
  private normalizer = new (require('@nlpjs/lang-es/src/normalizer-es'))()

  normalize(text: string): string {
    return this.normalizer.normalize(text)
  }
}
