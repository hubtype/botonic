import { Normalizer } from '../types'

export class NormalizerEn implements Normalizer {
  readonly locale = 'en'

  normalize(text: string): string {
    return text.trim().toLowerCase()
  }
}
