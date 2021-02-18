import { Normalizer } from '../../types'

export default class NormalizerEn implements Normalizer {
  readonly locale = 'en'
  normalize(text: string): string {
    return text.trim().toLowerCase()
  }
}
